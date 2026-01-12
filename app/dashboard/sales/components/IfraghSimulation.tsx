import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, FileText, CheckCircle, Clock, AlertCircle, Smartphone, User, Loader2 } from 'lucide-react';
import { useDirection } from '@/context/DirectionContext';

interface Message {
    id: string;
    sender: 'system' | 'customer';
    text: string;
    timestamp: string;
    type: 'text' | 'document' | 'status';
    fileName?: string;
}

export default function IfraghSimulation() {
    const { language } = useDirection();
    const [messages, setMessages] = useState<Message[]>([]);
    const [status, setStatus] = useState<'idle' | 'requesting' | 'collecting' | 'verifying' | 'completed'>('idle');
    const [progress, setProgress] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            ...message
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const startSimulation = () => {
        setStatus('requesting');
        setProgress(10);
        setMessages([]);

        const sequence = [
            { delay: 500, sender: 'system', text: language === 'ar' ? 'مرحباً، لبدء إجراءات الإفراغ، يرجى تزويدنا بصورة الصك وصورة الهوية.' : 'Hello, to start the transfer process, please provide a copy of the deed and ID.', type: 'text' },
            { delay: 2500, sender: 'customer', text: language === 'ar' ? 'مرحباً، تفضل هذه المستندات.' : 'Hi, here are the documents.', type: 'text' },
            { delay: 3500, sender: 'customer', text: language === 'ar' ? 'صورة_الصك.pdf' : 'Deed_Copy.pdf', type: 'document', fileName: 'Deed_Copy.pdf' },
            { delay: 4500, sender: 'customer', text: language === 'ar' ? 'الهوية_الوطنية.jpg' : 'National_ID.jpg', type: 'document', fileName: 'National_ID.jpg' },
            { delay: 5500, action: () => { setStatus('verifying'); setProgress(60); } },
            { delay: 6000, sender: 'system', text: language === 'ar' ? 'جاري التحقق من المستندات مع بوابة "ناجز"...' : 'Verifying documents with "Najiz" portal...', type: 'status' },
            { delay: 9000, action: () => { setStatus('completed'); setProgress(100); } },
            { delay: 9500, sender: 'system', text: language === 'ar' ? 'تم التحقق بنجاح! الصك جاهز للإفراغ.' : 'Verification successful! Deed is ready for transfer.', type: 'text' }
        ];

        let cumulativeDelay = 0;
        sequence.forEach((item: any) => {
            cumulativeDelay += item.delay;
            setTimeout(() => {
                if (item.action) {
                    item.action();
                } else {
                    addMessage({ sender: item.sender, text: item.text, type: item.type, fileName: item.fileName });
                }
            }, cumulativeDelay);
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Sidebar - Status & Info */}
            <div className="bg-obsidian/50 backdrop-blur-sm rounded-xl p-6 border border-desert-gold/20 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-desert-gold/20 rounded-lg">
                            <FileText className="h-6 w-6 text-desert-gold" />
                        </div>
                        <h3 className="text-xl font-bold text-elegant-white">
                            {language === 'ar' ? 'حالة الإفراغ' : 'Transfer Status'}
                        </h3>
                    </div>

                    <div className="space-y-6 relative">
                        {/* Progress Line */}
                        <div className="absolute top-4 bottom-4 inset-inline-start-3.5 w-0.5 bg-stone-gray/20 -z-10" />

                        <StatusStep
                            title={language === 'ar' ? 'طلب المستندات' : 'Request Documents'}
                            active={status !== 'idle'}
                            completed={['collecting', 'verifying', 'completed'].includes(status)}
                        />
                        <StatusStep
                            title={language === 'ar' ? 'استلام المستندات' : 'Receive Documents'}
                            active={['collecting', 'verifying', 'completed'].includes(status)}
                            completed={['verifying', 'completed'].includes(status)}
                        />
                        <StatusStep
                            title={language === 'ar' ? 'التحقق الآلي' : 'Auto Verification'}
                            active={['verifying', 'completed'].includes(status)}
                            completed={status === 'completed'}
                        />
                        <StatusStep
                            title={language === 'ar' ? 'جاهز للإفراغ' : 'Ready for Transfer'}
                            active={status === 'completed'}
                            completed={status === 'completed'}
                            isLast
                        />
                    </div>
                </div>

                {status === 'idle' ? (
                    <motion.button
                        onClick={startSimulation}
                        className="w-full bg-desert-gold text-deep-black py-4 rounded-lg font-bold hover:bg-warm-sand transition-all shadow-lg shadow-desert-gold/10 flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Send className="w-5 h-5" />
                        <span>{language === 'ar' ? 'بدء العملية' : 'Start Process'}</span>
                    </motion.button>
                ) : (
                    <div className="bg-stone-gray/10 rounded-lg p-4">
                        <div className="flex justify-between text-sm text-stone-gray mb-2">
                            <span>{language === 'ar' ? 'تقدم العملية' : 'Process Progress'}</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="h-2 bg-stone-gray/20 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-green-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Main Chat Interface */}
            <div className="lg:col-span-2 bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col border border-stone-gray/20">
                {/* Chat Header */}
                <div className="bg-[#075E54] p-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-full">
                            <Smartphone className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold">{language === 'ar' ? 'بوابة ناجز واتساب' : 'Najiz WhatsApp Portal'}</h4>
                            <span className="text-xs opacity-80">{language === 'ar' ? 'متصل الآن' : 'Online'}</span>
                        </div>
                    </div>
                    <div className="text-xs bg-white/20 px-2 py-1 rounded">
                        BOT
                    </div>
                </div>

                {/* Chat Messages */}
                <div
                    ref={scrollRef}
                    className="flex-1 bg-[#E5DDD5] p-6 overflow-y-auto space-y-4 font-sans text-sm"
                    style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d984a289d6.png')", backgroundBlendMode: 'overlay' }}
                >
                    <AnimatePresence>
                        {messages.length === 0 && status === 'idle' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center h-full text-gray-500 gap-4"
                            >
                                <User className="w-12 h-12 opacity-50" />
                                <p>{language === 'ar' ? 'اضغط "بدء العملية" لمحاكاة المحادثة' : 'Click "Start Process" to simulate chat'}</p>
                            </motion.div>
                        )}

                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex ${msg.sender === 'system' ? 'justify-start' : 'justify-end'}`}
                            >
                                <div
                                    className={`max-w-[70%] rounded-lg p-3 shadow-sm ${msg.type === 'status'
                                            ? 'bg-yellow-100 text-yellow-800 text-center mx-auto w-full max-w-[90%]'
                                            : msg.sender === 'system'
                                                ? 'bg-white text-gray-800 rounded-tr-lg'
                                                : 'bg-[#DCF8C6] text-gray-800 rounded-tl-lg'
                                        }`}
                                >
                                    {msg.type === 'document' ? (
                                        <div className="flex items-center gap-3">
                                            <div className="bg-red-500/10 p-2 rounded">
                                                <FileText className="w-6 h-6 text-red-500" />
                                            </div>
                                            <span className="font-medium underline">{msg.fileName}</span>
                                        </div>
                                    ) : msg.type === 'status' ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>{msg.text}</span>
                                        </div>
                                    ) : (
                                        <p>{msg.text}</p>
                                    )}
                                    {msg.type !== 'status' && (
                                        <div className={`text-[10px] mt-1 text-right opacity-60`}>
                                            {msg.timestamp}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Chat Input (Disabled) */}
                <div className="bg-[#F0F0F0] p-3 flex items-center gap-2">
                    <input
                        disabled
                        type="text"
                        placeholder={language === 'ar' ? 'اكتب رسالة...' : 'Type a message...'}
                        className="flex-1 bg-white rounded-full px-4 py-2 text-sm border-none focus:ring-0 disabled:opacity-70 disabled:cursor-not-allowed"
                    />
                    <button disabled className="p-2 bg-[#075E54] text-white rounded-full opacity-50 cursor-not-allowed">
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function StatusStep({ title, active, completed, isLast }: { title: string, active: boolean, completed: boolean, isLast?: boolean }) {
    return (
        <div className="relative flex items-center gap-4">
            <div className={`
                w-8 h-8 rounded-full flex items-center justify-center z-10 
                ${completed ? 'bg-green-500 text-white' : active ? 'bg-desert-gold text-deep-black animate-pulse' : 'bg-stone-gray/20 text-stone-gray'}
                transition-colors duration-300
            `}>
                {completed ? <CheckCircle className="w-5 h-5" /> : active ? <Loader2 className="w-4 h-4 animate-spin" /> : <div className="w-3 h-3 rounded-full bg-current" />}
            </div>
            <span className={`font-medium ${completed || active ? 'text-elegant-white' : 'text-stone-gray'}`}>
                {title}
            </span>
        </div>
    );
}
