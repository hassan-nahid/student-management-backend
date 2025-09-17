/* eslint-disable no-console */
import { envVars } from "../config/env"
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface"
import { User } from "../modules/user/user.model"
import bcryptjs from "bcryptjs"

export const seedSuperAdmin = async () => {
    try{
        const isSuperAdmin = await User.findOne({email: envVars.SUPER_ADMIN_EMAIL})
        if(isSuperAdmin){
            console.log("super admin already exists!")
            return
        }

        console.log('Trying to create super Admin.')

        const hashedPassword = await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND))

        const authProvider: IAuthProvider = {
            provider: "credentials",
            providerId: envVars.SUPER_ADMIN_EMAIL
        }

        const payload : IUser = {
            name: "Super Admin",
            role: Role.SUPER_ADMIN,
            email: envVars.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            auths: [authProvider],
            isVerified: true
        }

        const superAdmin = await User.create(payload)
        console.log("Super Admin Created Successfully\n")
        console.log("Super Admin", superAdmin)

    }catch(error){
        console.log(error)
    }
}