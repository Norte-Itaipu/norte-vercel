import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Head from 'next/head';
import { supabase } from '@/lib/supabase';

interface NewsFormData {
    title: string;
    description: string;
    link: string;
    date: string;
    image: File | null;
    imagePreview?: string;
    category: string;
    author?: string;
    tags: string;
}

const compressImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            const maxDimension = 800;
            if (width > height && width > maxDimension) {
                height = (height * maxDimension) / width;
                width = maxDimension;
            } else if (height > maxDimension) {
                width = (width * maxDimension) / height;
                height = maxDimension;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
            }
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convert to blob with reduced quality
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to compress image'));
                    }
                },
                'image/jpeg',
                0.7 // compression quality (0.7 = 70% quality)
            );
        };
        img.onerror = () => reject(new Error('Failed to load image'));
    });
};


interface FormErrors {
    title?: string;
    description?: string;
    link?: string;
    date?: string;
    image?: string;
    category?: string;
    author?: string;
    submit?: string;
}


const CATEGORIES = [
    'Geral',
    'Tecnologia',
    'Ciência',
    'Educação',
    'Meio Ambiente',
    'Eventos',
    'Projetos'
];

export default function NewsForm() {
    const [formData, setFormData] = useState<NewsFormData>({
        title: '',
        description: '',
        link: '',
        date: new Date().toISOString().split('T')[0],
        image: null,
        category: 'Geral',
        author: undefined,
        tags: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [success, setSuccess] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const router = useRouter();

    // Verificar autenticação e tema
    useEffect(() => {
        const authStatus = localStorage.getItem('isAdminAuthenticated');
        const savedTheme = localStorage.getItem('adminTheme');

        if (!authStatus) {
            router.push('/admin/login');
            return;
        }

        setIsAuthenticated(true);
        setDarkMode(savedTheme === 'dark');

        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        }
    }, [router]);

    // Validação do formulário
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Título é obrigatório';
        } else if (formData.title.length < 5) {
            newErrors.title = 'Título deve ter pelo menos 5 caracteres';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Descrição é obrigatória';
        } else if (formData.description.length < 20) {
            newErrors.description = 'Descrição deve ter pelo menos 20 caracteres';
        }

        if (formData.link && !/^https?:\/\/.+\..+/.test(formData.link)) {
            newErrors.link = 'URL inválida';
        }

        if (!formData.date) {
            newErrors.date = 'Data é obrigatória';
        }

        if (!formData.image) {
            newErrors.image = 'Imagem é obrigatória';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Limpar erro do campo quando usuário começar a digitar
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const compressImage = async (file: File): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                const maxDimension = 800;
                if (width > height && width > maxDimension) {
                    height = (height * maxDimension) / width;
                    width = maxDimension;
                } else if (height > maxDimension) {
                    width = (width * maxDimension) / height;
                    height = maxDimension;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to blob with reduced quality
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Failed to compress image'));
                        }
                    },
                    'image/jpeg',
                    0.7 // compression quality (0.7 = 70% quality)
                );
            };
            img.onerror = () => reject(new Error('Failed to load image'));
        });
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Validar tipo e tamanho do arquivo
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({ ...prev, image: 'Por favor, selecione um arquivo de imagem' }));
                return;
            }

            try {
                const compressedImage = await compressImage(file);
                if (compressedImage.size > 1024 * 1024) { // 1MB
                    setErrors(prev => ({ ...prev, image: 'A imagem é muito grande mesmo após compressão' }));
                    return;
                }

                setFormData(prev => ({
                    ...prev,
                    image: new File([compressedImage], file.name, { type: 'image/jpeg' }),
                    imagePreview: URL.createObjectURL(compressedImage)
                }));

                // Limpar erro de imagem
                if (errors.image) {
                    setErrors(prev => ({ ...prev, image: undefined }));
                }
            } catch (err) {
                setErrors(prev => ({ ...prev, image: 'Erro ao processar a imagem' }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Upload da imagem para o Supabase Storage
            let imagePath = '';
            if (formData.image && formData.image instanceof File) {
                // Comprimir a imagem antes do upload
                const compressedImage = await compressImage(formData.image);
                const fileExt = formData.image.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExt}`;
                
                const { data: uploadData, error: uploadError } = await supabase
                    .storage
                    .from('noticias')
                    .upload(fileName, compressedImage, {
                        contentType: 'image/jpeg'
                    });

                if (uploadError) {
                    throw new Error('Erro ao fazer upload da imagem');
                }

                // Pegar a URL pública da imagem
                const { data: { publicUrl } } = supabase
                    .storage
                    .from('noticias')
                    .getPublicUrl(fileName);

                imagePath = publicUrl;
            }

            const noticiaData = {
                title: formData.title,
                description: formData.description,
                link: formData.link,
                date: formData.date,
                image: imagePath,
                slug: formData.title.toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-'),
                category: formData.category,
                author: formData.author,
                tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
            };

            // Inserir diretamente no Supabase
            const { error: insertError } = await supabase
                .from('noticias')
                .insert([noticiaData]);

            if (insertError) {
                throw new Error('Erro ao salvar notícia');
            }

            setSuccess('Notícia publicada com sucesso!');

            // Limpar o formulário após sucesso
            setFormData({
                title: '',
                description: '',
                link: '',
                date: new Date().toISOString().split('T')[0],
                image: null,
                category: 'Geral',
                author: '',
                tags: ''
            });

            // Limpar preview da imagem
            if (formData.imagePreview) {
                URL.revokeObjectURL(formData.imagePreview);
            }
        } catch (err) {
            setErrors(prev => ({
                ...prev,
                submit: 'Erro ao publicar notícia. Tente novamente.'
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isAdminAuthenticated');
        router.push('/admin/login');
    };

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);

        if (newDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        localStorage.setItem('adminTheme', newDarkMode ? 'dark' : 'light');
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <>
            {/* <Head>
        <title>Gerenciar Notícias | Painel Administrativo</title>
        <meta name="description" content="Adicione e gerencie notícias do site" />
      </Head> */}

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 pt-28">
                {/* Header */}
                <header className="bg-white dark:bg-gray-800 shadow-sm fixed top-0 left-0 right-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Painel Administrativo
                        </h1>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                aria-label="Alternar tema"
                            >
                                {darkMode ? (
                                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 01-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                    </svg>
                                )}
                            </button>

                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                Sair
                            </button>
                        </div>
                    </div>
                </header>

                <main className="max-w-4xl mx-auto p-6">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Adicionar Nova Notícia</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Preencha os campos abaixo para publicar uma nova notícia
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                        {errors.submit && (
                            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 flex items-start">
                                <svg className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm text-red-700 dark:text-red-300">{errors.submit}</p>
                            </div>
                        )}

                        {success && (
                            <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4 flex items-start">
                                <svg className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Título *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className={`block w-full rounded-md border ${errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'} shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 transition-colors`}
                                    placeholder="Digite o título da notícia"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Categoria *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 transition-colors"
                                >
                                    {CATEGORIES.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Descrição *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={5}
                                className={`block w-full rounded-md border ${errors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'} shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 transition-colors`}
                                placeholder="Forneça uma descrição detalhada da notícia"
                            />
                            <div className="flex justify-between mt-1">
                                {errors.description ? (
                                    <p className="text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Mínimo de 20 caracteres
                                    </p>
                                )}
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {formData.description.length}/1000
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Link (opcional)
                                </label>
                                <input
                                    type="url"
                                    name="link"
                                    value={formData.link}
                                    onChange={handleInputChange}
                                    className={`block w-full rounded-md border ${errors.link ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'} shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 transition-colors`}
                                    placeholder="https://exemplo.com/noticia"
                                />
                                {errors.link && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.link}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Data de Publicação *
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className={`block w-full rounded-md border ${errors.date ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'} shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 transition-colors`}
                                />
                                {errors.date && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Autor (opcional)
                                </label>
                                <input
                                    type="text"
                                    name="author"
                                    value={formData.author}
                                    onChange={handleInputChange}
                                    className={`block w-full rounded-md border ${errors.author ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'} shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 transition-colors`}
                                    placeholder="Nome do autor"
                                />
                                {errors.author && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.author}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Tags (opcional)
                                </label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 transition-colors"
                                    placeholder="tag1, tag2, tag3"
                                />
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Separe as tags com vírgulas
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Imagem de Capa *
                            </label>
                            <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${errors.image ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'} border-dashed rounded-md transition-colors`}>
                                <div className="space-y-1 text-center">
                                    {formData.imagePreview ? (
                                        <div className="relative h-40 w-full mx-auto">
                                            <Image
                                                src={formData.imagePreview}
                                                alt="Preview"
                                                fill
                                                className="object-contain rounded"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, image: null, imagePreview: undefined }));
                                                    setErrors(prev => ({ ...prev, image: undefined }));
                                                }}
                                                className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                                <label htmlFor="image-upload" className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 transition-colors">
                                                    <span>Enviar uma imagem</span>
                                                    <input
                                                        id="image-upload"
                                                        name="image"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        className="sr-only"
                                                    />
                                                </label>
                                                <p className="pl-1">ou arraste e solte</p>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                PNG, JPG, GIF até 5MB
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                            {errors.image && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.image}</p>
                            )}
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors flex items-center"
                            >
                                {isLoading && (
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {isLoading ? 'Publicando...' : 'Publicar Notícia'}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </>
    );
}