const knex = require("../databases/Connection");
const bcrypt = require("bcrypt");

class User {

    async new (email, senha, nivelPermissao) {
        try {
            const salt = await bcrypt.genSalt(10);
            const senhaHash = await bcrypt.hash(senha, salt);

            await knex.insert({ email, senha: senhaHash, nivel_permissao: nivelPermissao }).table('tbl_user');
        } catch (err) {
            console.log(err);
        }
    }

    async findAll () {
        try {
            const result = await knex.select("*").table("tbl_user");
            return result;
        } catch (err) {
            console.log(err);   
            return [];
        }
    }

    async findById(id){
        try {
            const result = await knex.select("*").where({ id }).table("tbl_user");
            
            if(result.length > 0)
                return result[0];
            else
                return undefined;

        } catch (err) {
            console.log(err);   
            return [];
        }
    }

    async findByEmail(email){
        try {
            const result = await knex.select("*").where({ email }).table("tbl_user");
            
            if(result.length > 0)
                return result[0];
            else
                return undefined;

        } catch (err) {
            console.log(err);   
            return [];
        }
    }

    async emailExists(email) {
        try {
            const result = await knex.select("*").from("tbl_user").where({ email });

            if (result.length > 0)
                return true;
            else
                return false;
        } catch (err) {
            console.log(err);
            return false
        }
    }

    async update(id, email, senha, nivelPermissao){
        const user = await this.findById(id);

        if (user != undefined){
            const editUser = {};

            // Verifica se o email não é undefined e atualiza caso já não exista
            if(email != undefined){
                if(email != user.email){
                    const result = await this.emailExists(email);

                    if (result)
                        return { status: false, err: "O email já está cadastrado." };

                    editUser.email = email || user.email;
                }
            } 

            if (senha != undefined) {
                const salt = await bcrypt.genSalt(10);
                const senhaHash = await bcrypt.hash(senha, salt);
                editUser.senha = senhaHash
            }

            editUser.nivel_permissao = nivelPermissao || user.nivel_permissao; 

            try {
                await knex.update(editUser).where({ id: id }).table("tbl_user");
                return { status: true }
            } catch (err) {
                return { status: false, err: err }
            }

        } else
            return { status : false, err: "O usuário não existe." };
    }

    async delete (id){
        const user = await this.findById(id);

        if (user != undefined){
            try {
                await knex.delete().where({ id:id }).table("tbl_user");
                return { status: true }
            }
            catch (err) {
                console.log(err);
                return { status: false, err: err }  
            }
                
        } else 
            return { status: false, err: "O usuário não existe, portanto não pode ser deletado." }    
   }


}

module.exports = new User();
