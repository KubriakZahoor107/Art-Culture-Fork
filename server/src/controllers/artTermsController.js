import prisma from '../../prismaClient.js'
import { body, validationResult } from "express-validator"

export const getArtTermsByLang = async (req, res, next) => {
    try {
        let lang = req.params.lang ?? "uk"
        lang = lang.split('-')[0]
        if (lang != "uk" && lang != "en") {
            lang = "uk"
        }

        const orderBy = lang === "uk" ? { title_uk: 'asc' } : { title_en: 'asc' };
        const artTerms = await prisma.artTerm.findMany({
            orderBy: orderBy,
            include: {
                highlightedProduct: {
                    include: {
                        images: true,
                        author: true,
                    }
                },
            },
        });

        const terms = artTerms.map(term => {
            return lang === "uk"
                ? { id: term.id, letter: term.title_uk[0], title: term.title_uk, description: term.description_uk, highlightedProduct: term.highlightedProduct }
                : { id: term.id, letter: term.title_en[0], title: term.title_en, description: term.description_en, highlightedProduct: term.highlightedProduct };
        })
        const firstTerms = [];
        terms.forEach(item => {
            const letterExists = firstTerms.filter(term => term.letter === item.letter).length
            if (letterExists) {
                return;
            }

            firstTerms.push(item);
        })

        res.json({ artTerms: firstTerms })
    } catch (error) {
        console.error('Error fetch data art-term id', error)
        next(error)
    }
}

export const getLastArtTerms = async (req, res, next) => {
    try {
        let lang = req.params.lang ?? "uk"
        lang = lang.split('-')[0]
        if (lang != "uk" && lang != "en") {
            lang = "uk"
        }

        const orderBy = { createdAt: 'desc' };
        const artTerms = await prisma.artTerm.findMany({
            orderBy: orderBy,
            include: {
                highlightedProduct: {
                    include: {
                        images: true,
                        author: true,
                    }
                },
            },
            take: 15,
        });

        res.json({ artTerms: artTerms })
    } catch (error) {
        console.error('Error fetch data art-term id', error)
        next(error)
    }
}

export const getArtTermsByLetter = async (req, res, next) => {
    try {
        let letter = req.params.letter
        if (!letter) {
            return res.status(400).json({ error: 'invalid letter' })
        }

        letter = letter[0]
        const orderBy = letter === "uk" ? { title_uk: 'asc' } : { title_en: 'asc' };
        const artTerms = await prisma.artTerm.findMany({
            orderBy: orderBy,
            where: {
                OR: [
                    {
                        title_uk: {
                            startsWith: letter
                        }
                    },
                    {
                        title_en: {
                            startsWith: letter
                        }
                    },
                ]
            },
            include: {
                highlightedProduct: {
                    include: {
                        images: true,
                        author: true,
                    }
                },
            },
        });

        res.json({ artTerms })
    } catch (error) {
        console.error('Error fetch data art-term id', error)
        next(error)
    }
}

export const getArtTermById = async (req, res, next) => {
    try {
        let id = req.params.id
        if (!id) {
            return res.status(400).json({ error: 'invalid letter' })
        }

        id = parseInt(id);
        const artTerm = await prisma.artTerm.findFirstOrThrow({
            where: {
                id: id
            },
            include: {
                highlightedProduct: {
                    include: {
                        author: true,
                        images: true,
                    }
                },
            },
        });

        res.json({ artTerm })
    } catch (error) {
        console.error('Error fetch data art-term id', error)
        next(error)
    }
}

export const getPagesArtTerms = async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        let page = req.params.page ?? 1;
        let pageSize = req.params.pageSize ?? 20;
        let orderBy = req.params.orderBy ?? "createdAt";
        let validColumns = [
            ["createdAt", "desc"], 
            ["title", "asc"],
            ["status", "asc"],
        ];
        if (!validColumns.some((col) => col[0] === orderBy)) {
            return res.status(400).json({ error: "Invalid sort order" });
        }

        let orderDir = req.params.orderDir ?? validColumns.find((col) => col[0] === orderBy)[1];
        page = parseInt(page);
        pageSize = parseInt(pageSize);
        if (pageSize > 20) pageSize = 20;
        if (page < 1) page = 1;
        const { search } = req.query
        const filter = {
            OR: [
                { title_uk: { contains: search/*, mode: 'insensitive',*/ } },
                { title_en: { contains: search/*, mode: 'insensitive',*/ } },
                { description_uk: { contains: search/*, mode: 'insensitive',*/ } },
                { description_en: { contains: search/*, mode: 'insensitive',*/ } },
            ]
        }

        page = parseInt(page);
        pageSize = parseInt(pageSize);
        if (pageSize > 20) pageSize = 20;
        if (page < 1) page = 1;

        const mainQuery = {
            where: { ...filter },
            select: {
                id: true,
                title_uk: true,
                title_en: true,
                description_uk: true,
                description_en: true,
            },
        }

        const artTerms = await prisma.artTerm.findMany({
            ...mainQuery,
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { [orderBy]: orderDir },
        });

        res.json({ artTerms })
    } catch (error) {
        console.error('Error fetch data art-term id', error)
        next(error)
    }
}