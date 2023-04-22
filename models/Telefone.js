const knex = require("../databases/Connection");

class Telefone {

    async new (ddd, numero) {
        try {
            await knex.insert({ ddd, numero }).table('tbl_telefone');
        } catch (err) {
            console.log(err);
        }
    }

    async findAll() {
        try {
            const result = await knex.select("*").table("tbl_telefone");
            return result;
        } catch (err) {
            console.log(err);   
            return [];
        }
    }

    async findById(id){
        try {
            const result = await knex.select("*").where({ id: id }).table("tbl_telefone");
            
            if(result.length > 0)
                return result[0];
            else
                return undefined;

        } catch (err) {
            console.log(err);   
            return [];
        }
    }

    async getId(ddd, numero) {
        const telefone = await knex.select("*").table("tbl_telefone").where({ ddd, numero });

        if (telefone.length > 0){
            return telefone[0].id;
        } else {
            return undefined;
        }
    }

    async checkExists(queryParams={}) {
        try {
            const result = await knex.select("*").from("tbl_telefone").where(queryParams);

            if (result.length > 0)
                return true;
            else
                return false;
        } catch (err) {
            console.log(err);
            return false
        }
    }

    async update(id, ddd, numero){
        const telefone = await this.findById(id);

        if (telefone != undefined){
            const editTelefone = {};

            editTelefone.ddd = ddd || telefone.ddd;
            editTelefone.numero = numero || telefone.numero; 

            try {
                await knex.update(editTelefone).where({ id: id }).table("tbl_telefone");
                return { status: true }
            } catch (err) {
                return { status: false, err: err }
            }

        } else
            return { status : false, err: "O telefone não existe." };
    }

    async delete (id){
        const telefone = await this.findById(id);

        if (telefone != undefined){
            try {
                await knex.delete().where({ id: id }).table("tbl_telefone");
                return { status: true }
            }
            catch (err) {
                return { status: false, err: err }  
            }
                
        } else 
            return { status: false, err: "Não existe telefone cadastrado, portanto não pode ser deletado." }    
   }

}

module.exports = new Telefone();
