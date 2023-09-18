const {body} = require('express-validator')

const photoInsertValidation = () => {
    return [
        body('title')
            .not()
            .equals('undefined')
            .withMessage('O título é obrigatório!')
            .isString()
            .withMessage('O título precisa conter letras!')
            .isLength({min: 5})
            .withMessage('O título precisa conter no mínimo 5 letras'),
        body('image')
        .custom((value, {req}) => {
            if (!req.file) {
                throw new Error('A imagem é obrigatória!')
            }
            return true
        })
    ]
}

const photoUpdateValidation = () => {
    return [
        body('title')
            .optional()
            .isString()
            .withMessage('O título é obrigatório para atualização da postagem!')
            .isLength({min: 5})
            .withMessage('O título precisa conter no mínimo 5 letras')
    ]
}

const commentValidation = () => {
    return [
        body('comment')
        .isString()
        .withMessage('O comentário é obrigatório como texto!')
        .isLength({min: 5})
        .withMessage('O comentário deve conter no mínimo 5 letras!')
    ]
}

module.exports = {photoInsertValidation, photoUpdateValidation, commentValidation}