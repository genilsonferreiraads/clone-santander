import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../components/Icons';
import { User, Transaction } from '../types';
import { createWorker } from 'tesseract.js';

const GEMINI_API_KEY = "AIzaSyAp7_z54oChA5z1MsNqLoz5lVh1fav6iv8";

interface SettingsProps {
    onBack: () => void;
    user: User;
    onUpdateUser: (newUser: User, newTransaction?: Transaction) => void;
    onRedirectToPix: () => void;
}

const PLATFORMS = [
    { name: 'Lançamentos LTDA', cnpj: '21.093.570/0001-38', display: 'Hotmart (Lançamentos LTDA)' },
    { name: 'Monetizze Meios de Pagamento LTDA', cnpj: '23.055.665/0001-06', display: 'Monetizze' },
    { name: 'Kiwify Meios de Pagamento LTDA', cnpj: '36.149.947/0001-06', display: 'Kiwify' },
    { name: 'Eduzz Tecnologia LTDA', cnpj: '19.123.023/0001-18', display: 'Eduzz' },
    { name: 'Braip Tecnologia LTDA', cnpj: '34.195.122/0001-64', display: 'Braip' },
    { name: 'Tikto Meios de Pagamento LTDA', cnpj: '34.331.439/0001-20', display: 'Tikto' },
    { name: 'Perfect Pay Tecnologia LTDA', cnpj: '32.844.755/0001-57', display: 'Perfect Pay' },
    { name: 'Kirvano Meios de Pagamento LTDA', cnpj: '49.378.140/0001-02', display: 'Kirvano' },
    { name: 'Dozzo Pagamentos LTDA', cnpj: '41.222.111/0001-99', display: 'Dozzo' },
    { name: 'PayT Tecnologia e Pagamentos LTDA', cnpj: '35.111.000/0001-88', display: 'PayT' },
];

const BANKS = [
    'NU PAGAMENTOS - IP',
    'BCO SANTANDER (BRASIL) S.A.',
    'BANCO DO BRASIL S.A.',
    'CAIXA ECONOMICA FEDERAL',
    'BANCO BRADESCO S.A.',
    'ITAÚ UNIBANCO S.A.',
    'BANCO INTER S.A.',
    'BANCO C6 S.A.',
    'MERCADO PAGO IP LTDA.',
    'PICPAY SERVICOS S.A.',
    'BANCO BTG PACTUAL S.A.',
    'BANCO NEON S.A.',
    'BANCO ORIGINAL S.A.',
    'BANCO VOTORANTIM S.A.',
    'PAGSEGURO INTERNET S.A.'
];

const Settings: React.FC<SettingsProps> = ({ onBack, user, onUpdateUser, onRedirectToPix }) => {
    const [amountToAdd, setAmountToAdd] = useState('0,00');
    const [selectedPlatformIndex, setSelectedPlatformIndex] = useState(0);
    const [payeeName, setPayeeName] = useState('');
    const [payeeBank, setPayeeBank] = useState('NU PAGAMENTOS - IP');
    const [payeeCpfDigits, setPayeeCpfDigits] = useState('');
    const [ocrKey, setOcrKey] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isBankSheetOpen, setIsBankSheetOpen] = useState(false);
    const [isPlatformSheetOpen, setIsPlatformSheetOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isBalanceExpanded, setIsBalanceExpanded] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const savedPayee = localStorage.getItem('santander_clone_settings_payee');
        if (savedPayee) {
            const parsed = JSON.parse(savedPayee);
            setPayeeName(parsed.name || '');
            setPayeeBank(parsed.bank || 'NU PAGAMENTOS - IP');
            if (parsed.cpf) {
                const match = parsed.cpf.match(/\*\*\*\.(\d{3})\.(\d{3})-\*\*/);
                if (match) setPayeeCpfDigits(match[1] + match[2]);
            }
        }
    }, []);

    const capitalizeName = (raw: string) => {
        return raw.replace(/([a-zA-ZÀ-ÿ]+)/g, (word) => {
            if (word.length > 2) return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            return word.toLowerCase();
        });
    };

    /**
     * Rotina de pós-processamento determinística para CPF mascarado.
     */
    const cleanOCRDigitsForCPF = (rawCpfSegment: string): string => {
        const ocrCharMap: Record<string, string> = {
            'O': '0', 'o': '0', 'Q': '0', 'D': '0', 'C': '0', 'c': '0',
            'A': '4', 'a': '4',
            'I': '1', 'l': '1', '|': '1',
            'S': '3', 's': '3', // No Itaú/Caixa, S/s costumam ser 3. 
            'B': '8',
            'Z': '2',
            'G': '9', 'b': '6', // G no Itaú é interpretado como 9
            'E': '3',
            '/': '7', '\\': '7', 'T': '7', 't': '7',
            'g': '9', 'q': '9',
            '8': '8', '7': '7', '6': '6', '3': '3'
        };

        const hasMask = /[\.\*\•\-]/.test(rawCpfSegment);
        let correctedSegment = '';
        for (const char of rawCpfSegment) {
            if (/\d/.test(char)) {
                correctedSegment += char;
            } else if (hasMask && ocrCharMap[char] !== undefined) {
                correctedSegment += ocrCharMap[char];
            }
        }
        return correctedSegment;
    };

    const processOCRText = (text: string) => {
        console.log('=== OCR DEBUG ===');
        console.log('📄 Texto bruto capturado pelo OCR:');
        console.log(text);
        console.log('=================');

        let newName = '';
        let newCpf = '';
        let newBank = 'NU PAGAMENTOS - IP';
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        const ignoreKeywords = ['valor', 'pago', 'data', 'hora', 'comprovante', 'pix', 'cpf', 'chave', 'banco'];

        console.log('📋 Linhas processadas:');
        lines.forEach((line, idx) => {
            console.log(`  [${idx}]: "${line}"`);
        });

        // 1. Extração do Nome
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (ignoreKeywords.some(kw => line.toLowerCase().startsWith(kw))) continue;
            if (line.length < 5 || (line.match(/\d/g) || []).length > 3) continue;
            if (/^[a-zA-ZÀ-ÿ\s\.]+$/.test(line) && line.includes(' ')) {
                newName = capitalizeName(line);
                console.log(`✅ Nome encontrado: "${newName}"`);
                break;
            }
        }

        // 2. Extração e Correção do CPF
        console.log('🔍 Buscando CPF mascarado...');
        for (const line of lines) {
            // Regex cirúrgico: busca 2 a 3 caracteres (números ou letras ambíguas) + separador + 3 caracteres
            // Exemplo: 438.494 , ASB.AGA , ***.494
            const cpfPattern = /([a-zA-Z0-9\*•]{2,3})[\.\*•\-]([a-zA-Z0-9\*•]{3})/;
            const match = line.match(cpfPattern);

            if (match) {
                console.log(`  📌 Padrão de CPF detectado na linha: "${line}"`);
                const part1 = cleanOCRDigitsForCPF(match[1]);
                const part2 = cleanOCRDigitsForCPF(match[2]);

                // Se as duas partes juntas formarem algo próximo de 6 dígitos
                const combined = (part1 + part2).replace(/\D/g, '');
                if (combined.length >= 5) {
                    newCpf = combined.substring(0, 6).padStart(6, '0');
                    console.log(`  ✅ CPF extraído via padrão: ${newCpf}`);
                    break;
                }
            }
        }

        // Fallback: se o padrão falhar, tenta a limpeza geral (com cautela)
        if (!newCpf) {
            for (const line of lines) {
                const digits = cleanOCRDigitsForCPF(line);
                if (digits.length === 6) {
                    newCpf = digits;
                    break;
                }
            }
        }

        // 3. Identificação do Banco
        const lowerText = text.toLowerCase();
        // Mapeamento completo de bancos para OCR
        const bankKeywords: { [key: string]: string } = {
            'pagseguro': 'PAGSEGURO INTERNET S.A.',
            'santander': 'BCO SANTANDER (BRASIL) S.A.',
            'caixa': 'CAIXA ECONOMICA FEDERAL',
            'bradesco': 'BANCO BRADESCO S.A.',
            'itau': 'ITAÚ UNIBANCO S.A.',
            'itaú': 'ITAÚ UNIBANCO S.A.',
            'nu': 'NU PAGAMENTOS - IP',
            'inter': 'BANCO INTER S.A.',
            'c6': 'BANCO C6 S.A.',
            'mercado': 'MERCADO PAGO IP LTDA.',
            'picpay': 'PICPAY SERVICOS S.A.',
            'btg': 'BANCO BTG PACTUAL S.A.',
            'neon': 'BANCO NEON S.A.',
            'original': 'BANCO ORIGINAL S.A.',
            'votorantim': 'BANCO VOTORANTIM S.A.',
            'brasil': 'BANCO DO BRASIL S.A.'
        };
        for (const [key, bankName] of Object.entries(bankKeywords)) {
            if (lowerText.includes(key)) { newBank = bankName; break; }
        }

        console.log('=== RESULTADO FINAL ===');
        console.log(`👤 Nome: "${newName}"`);
        console.log(`🆔 CPF (6 dígitos): "${newCpf}"`);
        console.log(`🏦 Banco: "${newBank}"`);
        console.log('=======================');

        setTimeout(() => {
            if (newName) setPayeeName(newName);
            setPayeeCpfDigits(newCpf);
            setPayeeBank(newBank);
            setOcrKey(prev => prev + 1);
        }, 150);
    };

    const preprocessImage = (image: HTMLImageElement): string => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return image.src;

        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const w = canvas.width;
        const h = canvas.height;

        // 1. Sharpen + Threshold (Binarização agressiva)
        const weights = [0, -1, 0, -1, 5, -1, 0, -1, 0];
        const output = ctx.createImageData(w, h);
        const dst = output.data;

        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            const val = avg > 120 ? 255 : 0; // Threshold 120 para encorpar
            data[i] = data[i + 1] = data[i + 2] = val;
        }

        // 2. Dilation (Dilatação Morfológica)
        // Técnica de Ouro: Engorda pixels pretos para conectar partes finas do "7"
        for (let y = 1; y < h - 1; y++) {
            for (let x = 1; x < w - 1; x++) {
                const idx = (y * w + x) * 4;
                let minVal = 255;
                // Busca se há algum pixel preto (0) na vizinhança 3x3
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const kidx = ((y + ky) * w + (x + kx)) * 4;
                        if (data[kidx] < minVal) minVal = data[kidx];
                    }
                }
                dst[idx] = dst[idx + 1] = dst[idx + 2] = minVal;
                dst[idx + 3] = 255;
            }
        }

        ctx.putImageData(output, 0, 0);
        return canvas.toDataURL('image/png', 1.0);
    };

    const callGeminiVision = async (file: File) => {
        try {
            console.log('🤖 Chamando Gemini Vision via Fetch...');
            const reader = new FileReader();
            const base64Promise = new Promise<string>((resolve) => {
                reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
                reader.readAsDataURL(file);
            });

            const base64Data = await base64Promise;

            const payload = {
                contents: [{
                    parts: [
                        { text: "A partir desta imagem de comprovante de Pix, extraia estas informações em formato JSON: { \"nome\": \"NOME COMPLETO\", \"cpf_central\": \"6 DIGITOS CENTRAIS\", \"banco\": \"NOME DO BANCO\" }" },
                        { inlineData: { mimeType: file.type, data: base64Data } }
                    ]
                }]
            };

            // Usando o modelo solicitado pelo usuário (2.0 Flash) no endpoint v1beta
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Erro detalhado da API do Google:', errorText);
                return;
            }

            const result = await response.json();

            if (result.candidates && result.candidates[0].content.parts[0].text) {
                const responseText = result.candidates[0].content.parts[0].text;
                console.log('🤖 Resposta Gemini:', responseText);

                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const data = JSON.parse(jsonMatch[0]);
                    if (data.nome) setPayeeName(capitalizeName(data.nome));
                    if (data.cpf_central) {
                        const digits = data.cpf_central.replace(/\D/g, '').slice(0, 6);
                        if (digits.length === 6) setPayeeCpfDigits(digits);
                    }
                    if (data.banco) {
                        const lowerBank = data.banco.toLowerCase();
                        const bankKeywords: { [key: string]: string } = {
                            'pagseguro': 'PAGSEGURO INTERNET S.A.', 'santander': 'BCO SANTANDER (BRASIL) S.A.', 'caixa': 'CAIXA ECONOMICA FEDERAL',
                            'bradesco': 'BANCO BRADESCO S.A.', 'itau': 'ITAÚ UNIBANCO S.A.', 'nu': 'NU PAGAMENTOS - IP', 'inter': 'BANCO INTER S.A.', 'c6': 'BANCO C6 S.A.',
                            'mercado': 'MERCADO PAGO IP LTDA.', 'picpay': 'PICPAY SERVICOS S.A.', 'btg': 'BANCO BTG PACTUAL S.A.', 'neon': 'BANCO NEON S.A.',
                            'original': 'BANCO ORIGINAL S.A.', 'votorantim': 'BANCO VOTORANTIM S.A.', 'brasil': 'BANCO DO BRASIL S.A.'
                        };
                        for (const [key, bankName] of Object.entries(bankKeywords)) {
                            if (lowerBank.includes(key)) { setPayeeBank(bankName); break; }
                        }
                    }
                    setOcrKey(prev => prev + 1);
                }
            }
        } catch (error) { console.error('Er Gemini:', error); }
    };


    const handleImageUpload = async (file: File) => {
        if (isProcessing) return; // Evita processamentos simultâneos que travam o navegador

        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        setPayeeName(prev => prev || 'Lendo...');
        setPayeeCpfDigits('');
        setOcrKey(prev => prev + 1);
        setIsProcessing(true);

        try {
            const img = new Image();
            img.src = objectUrl;
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = () => reject(new Error("Falha ao carregar imagem"));
            });

            const processedImageData = preprocessImage(img);
            const worker = await createWorker(['por', 'eng']);

            await worker.setParameters({
                tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.*•-●+:() ',
                tessedit_pageseg_mode: '3' as any,
            });

            const ret = await worker.recognize(processedImageData);
            processOCRText(ret.data.text);
            await worker.terminate();

            // 2. Chamada Gemini para validação 100%
            await callGeminiVision(file);
        } catch (error) {
            console.error("Erro OCR:", error);
            alert("Erro ao ler imagem. Tente novamente.");
        } finally {
            setIsProcessing(false);
            // Liberamos o objeto mas o previewUrl continua no estado do React
            // URL.revokeObjectURL(objectUrl); // Opcional, mantemos para o preview
        }
    };

    const handleClipboardRead = async () => {
        try {
            const items = await navigator.clipboard.read();
            for (const item of items) {
                if (item.types.some(type => type.startsWith('image/'))) {
                    const imageType = item.types.find(type => type.startsWith('image/'))!;
                    const blob = await item.getType(imageType);
                    handleImageUpload(new File([blob], "paste.png", { type: blob.type }));
                    return;
                }
            }
            alert("Nenhuma imagem encontrada na área de transferência.");
        } catch (e) {
            console.error(e);
            alert("Permissão negada ou erro ao acessar área de transferência.");
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
                const file = items[i].getAsFile();
                if (file) handleImageUpload(file);
                return;
            }
        }
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, '');
        if (!rawValue) { setAmountToAdd('0,00'); return; }
        const amount = parseInt(rawValue, 10) / 100;
        setAmountToAdd(amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
    };

    const handleSave = () => {
        const numericAmount = parseFloat(amountToAdd.replace(/\./g, '').replace(',', '.'));
        const platform = PLATFORMS[selectedPlatformIndex];
        const newBalance = user.balance + numericAmount;
        let newTx: Transaction | undefined;
        if (numericAmount > 0) {
            newTx = { id: 'manual_' + Date.now(), type: 'pix_received', description: `Pix recebido\n${platform.name}`, amount: numericAmount, date: new Date().toISOString() };
        }
        const finalCpf = payeeCpfDigits.length > 0 ? `***.${payeeCpfDigits.slice(0, 3)}.${payeeCpfDigits.slice(3, 6)}-**` : '***.438.494-**';
        localStorage.setItem('santander_clone_settings_payee', JSON.stringify({ name: payeeName, bank: payeeBank, cpf: finalCpf }));
        onUpdateUser({ ...user, balance: newBalance }, newTx);
        setShowSuccess(true);
        setTimeout(() => { setShowSuccess(false); onRedirectToPix(); }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col relative">
            <header className="bg-santander-red text-white pt-safe shadow-md z-30 relative shrink-0">
                <div className="h-[64px] px-4 flex items-center justify-between relative">
                    <button onClick={onBack} className="p-2 -ml-2 active:bg-white/10 rounded-full transition-colors z-10">
                        <Icons.ChevronRight className="rotate-180" size={26} strokeWidth={2.5} />
                    </button>
                    <h1 className="absolute inset-0 flex items-center justify-center text-[18px] font-bold pointer-events-none">Configurações</h1>
                    <div className="w-10 z-10"></div>
                </div>
            </header>

            <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar pb-32">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                        <Icons.Pix size={20} className="text-santander-red" />
                        Simulador Pix (Recebedor)
                    </h2>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Comprovante do Recebedor (Print)</label>
                        {previewUrl ? (
                            <div className="relative w-full border-2 border-santander-red bg-red-50 rounded-lg p-2 min-h-[140px] flex flex-col items-center justify-center">
                                <img src={previewUrl} className="h-40 mx-auto object-contain rounded" />
                                {isProcessing && <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center rounded"><Icons.RotateCcw className="animate-spin text-santander-red mb-1" size={32} /><span className="text-xs font-bold text-santander-red">Lendo...</span></div>}
                                <button onClick={() => setPreviewUrl(null)} className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md text-gray-600"><Icons.X size={16} /></button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3" onPaste={handlePaste}>
                                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg h-[80px] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition-colors">
                                    <div className="flex flex-col items-center text-gray-500">
                                        <Icons.Camera size={28} />
                                        <span className="text-sm font-medium mt-1">Galeria / Câmera</span>
                                    </div>
                                </div>
                                <button onClick={handleClipboardRead} className="w-full border-2 border-santander-red bg-red-50 text-santander-red rounded-lg py-4 font-bold flex items-center justify-center gap-2 active:bg-red-100 transition-colors">
                                    <Icons.Copy size={20} />
                                    Colar Print
                                </button>
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files?.[0]) {
                                    handleImageUpload(e.target.files[0]);
                                    // RESET DO INPUT: Crucial para não travar no próximo anexo
                                    e.target.value = '';
                                }
                            }}
                        />
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Recebedor</label>
                            <input key={`n-${ocrKey}`} type="text" value={payeeName} onChange={(e) => setPayeeName(capitalizeName(e.target.value))} className="w-full border border-gray-300 rounded p-2 text-gray-900 outline-none focus:border-santander-red" placeholder="Ex: Maria Silva" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CPF (6 dígitos centrais corrigidos)</label>
                            <input key={`c-${ocrKey}`} type="text" value={payeeCpfDigits} onChange={(e) => setPayeeCpfDigits(e.target.value.replace(/\D/g, '').slice(0, 6))} maxLength={6} className="w-full border border-gray-300 rounded p-2 text-gray-900 outline-none font-mono focus:border-santander-red" placeholder="000000" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Banco do Recebedor</label>
                            <button onClick={() => setIsBankSheetOpen(true)} className="w-full border border-gray-300 rounded p-3 text-left flex justify-between items-center bg-white text-[15px]">{payeeBank} <Icons.ChevronDown size={18} className="text-gray-400" /></button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <button onClick={() => setIsBalanceExpanded(!isBalanceExpanded)} className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-50 active:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-2">
                            <Icons.CircleDollarSign size={18} className="text-gray-400" />
                            <span className="text-sm text-gray-600">
                                Saldo: <span className="font-bold text-gray-800">R$ {user.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">{isBalanceExpanded ? 'Fechar' : 'Adicionar'}</span>
                            <Icons.ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isBalanceExpanded ? 'rotate-180' : ''}`} />
                        </div>
                    </button>
                    {isBalanceExpanded && (
                        <div className="p-4 pt-2 border-t border-gray-100 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Valor a Adicionar (R$)</label>
                                <input type="text" value={amountToAdd} onChange={handleAmountChange} inputMode="numeric" className="w-full border border-gray-300 rounded p-3 text-lg font-bold text-gray-900 focus:border-santander-red outline-none" placeholder="0,00" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Origem do Pix</label>
                                <button
                                    onClick={() => setIsPlatformSheetOpen(true)}
                                    className="w-full border border-gray-300 rounded p-3 text-left flex justify-between items-center bg-white text-[14px]"
                                >
                                    {PLATFORMS[selectedPlatformIndex].display}
                                    <Icons.ChevronDown size={18} className="text-gray-400" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 pb-8 z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                <button onClick={handleSave} className="w-full bg-santander-red text-white font-bold text-[16px] py-4 rounded shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2">
                    {showSuccess ? <><Icons.Check size={20} /> Salvo com sucesso!</> : 'Salvar Alterações'}
                </button>
            </div>

            {isBankSheetOpen && (
                <div className="fixed inset-0 z-50 flex flex-col justify-end">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" onClick={() => setIsBankSheetOpen(false)} />
                    <div className="bg-white rounded-t-2xl z-10 w-full max-h-[70vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center shrink-0">
                            <h3 className="font-bold text-lg">Selecione o Banco</h3>
                            <button onClick={() => setIsBankSheetOpen(false)}><Icons.X size={24} /></button>
                        </div>
                        <div className="overflow-y-auto p-2 pb-12">
                            {BANKS.map(b => (
                                <button key={b} onClick={() => { setPayeeBank(b); setIsBankSheetOpen(false); }} className={`w-full text-left py-4 px-4 border-b border-gray-50 transition-colors ${payeeBank === b ? 'text-santander-red font-bold bg-red-50 rounded-lg' : 'text-gray-700'}`}>{b}</button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {isPlatformSheetOpen && (
                <div className="fixed inset-0 z-50 flex flex-col justify-end">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" onClick={() => setIsPlatformSheetOpen(false)} />
                    <div className="bg-white rounded-t-2xl z-10 w-full max-h-[70vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center shrink-0">
                            <h3 className="font-bold text-lg">Origem do Pix</h3>
                            <button onClick={() => setIsPlatformSheetOpen(false)}><Icons.X size={24} /></button>
                        </div>
                        <div className="overflow-y-auto p-2 pb-12">
                            {PLATFORMS.map((p, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => { setSelectedPlatformIndex(idx); setIsPlatformSheetOpen(false); }}
                                    className={`w-full text-left py-4 px-4 border-b border-gray-50 transition-colors ${selectedPlatformIndex === idx ? 'text-santander-red font-bold bg-red-50 rounded-lg' : 'text-gray-700'}`}
                                >
                                    {p.display}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
