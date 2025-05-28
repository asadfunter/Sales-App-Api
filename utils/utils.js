const Utils = {


    sendUnProcessableIdentityResponse: (res, resp) => {

        return res.status(422).send({
            status: false,
            ...resp,
            data: null
        })
    },

    sendErrorResponse: (res, resp) => {

        return res.status(400).send({
            status: false,
            ...resp,
            data: null
        }
        )
    },
    sendNotFoundResponse: (res, resp) => {

        return res.status(404).send({
            status: false,
            ...resp,
            data: null
        }
        )
    },
    sendSuccessResponse: (res, data) => {

        return res.status(200).send({
            status: true,
            message: 'Success',
            data
        }
        )
    },
    CalcPagination: (currentpage, perPage) => {
        let skip = perPage * (currentpage - 1)
        return { skip: skip, limit: perPage }
    },
    Pagination: (data, currentPage, perPage, total) => {
        return {
            data: data,
            pagination: {
                currentPage, perPage, total,
                lastPage: Math.ceil(total / perPage),
                firstPage: 1
            }
        }
    }
}

module.exports = Utils;