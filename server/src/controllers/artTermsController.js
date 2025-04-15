import prisma from '../../prismaClient.js'

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
        let page = req.params.page ?? 1;
        let pageSize = req.params.pageSize ?? 20;
        let search = req.params.search;

        page = parseInt(page);
        pageSize = parseInt(pageSize);
        if (pageSize > 20) pageSize = 20;
        if (page < 1) page = 1;
        const artTerms = await prisma.artTerm.findMany({
            select: {
                id: true,
                title_uk: true,
                title_en: true,
                description_uk: true,
                description_en: true,
            },
            //skip: (page - 1) * pageSize,
            //take: pageSize,
        });

        res.json({ artTerms })
    } catch (error) {
        console.error('Error fetch data art-term id', error)
        next(error)
    }
}