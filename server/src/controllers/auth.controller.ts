

const userRegisterController = async (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        return res.status(500).json({ 
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error)
        });
    }
}

export {
    userRegisterController
}