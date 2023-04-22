const knex = require("../databases/Connection");

class Endereco {

    async new (rua, bairro, numero, complemento, cidade) {
        try {
            await knex.insert({rua, bairro, numero, complemento, cidade}).table('tbl_endereco');
        } catch (err) {
            console.log(err);
        }
    }

    async findAll() {
        try {
            const result = await knex.select("*").table("tbl_endereco");
            return result;
        } catch (err) {
            console.log(err);   
            return [];
        }
    }

    async findById(id){
        try {
            const result = await knex.select("*").where({id: id}).table("tbl_endereco");
            
            if(result.length > 0)
                return result[0];
            else
                return undefined;

        } catch (err) {
            console.log(err);   
            return [];
        }
    }

    async getId(rua, bairro, numero) {
        const endereco = await knex.select("*").table("tbl_endereco").where({ rua, bairro, numero });

        if (endereco.length > 0){
            return endereco[0].id;
        } else {
            return undefined;
        }
    }

    async checkExists(queryParams={}) {

        for (let key in queryParams) {
            if (typeof queryParams == "string")
                queryParams[key] = new RegExp(queryParams[key], "i")
        }

        try {
            const result = await knex.select("*").from("tbl_endereco").where(queryParams);

            if (result.length > 0)
                return true;
            else
                return false;
        } catch (err) {
            console.log(err);
            return false
        }
    }

    async update(id, rua, bairro, numero, complemento, cidade){
        const endereco = await this.findById(id);

        if (endereco != undefined){
            const editEndereco = {};

            editEndereco.rua = rua || endereco.rua;
            editEndereco.bairro = bairro || endereco.bairro; 
            editEndereco.numero = numero || endereco.numero; 
            editEndereco.complemento = complemento || endereco.complemento; 
            editEndereco.cidade = cidade || endereco.cidade;

            try {
                await knex.update(editEndereco).where({id: id}).table("tbl_endereco");
                return { status: true }
            } catch (err) {
                return { status: false, err: err }
            }

        } else
            return { status : false, err: "A endereco não existe." };
    }

    async delete (id){
        const endereco = await this.findById(id);

        if (endereco != undefined){
            try {
                await knex.delete().where({ id: id }).table("tbl_endereco");
                return { status: true }
            }
            catch (err) {
                return { status: false, err: err }  
            }
                
        } else 
            return { status: false, err: "Endereco não existe, portanto não pode ser deletado." }    
   }

}

module.exports = new Endereco();
