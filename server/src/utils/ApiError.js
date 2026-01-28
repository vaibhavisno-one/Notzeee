class ApiError extends error {
    constructor(
        statusCode,
        message ="",
        errors=[],
        stack=""
    ){
        super(message)
        this.statusCode=statusCode
        this.data = data
        this.message=message
        this.errors=errors
        this.stack=stack

        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}