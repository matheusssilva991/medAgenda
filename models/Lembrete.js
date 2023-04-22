const knex = require("../databases/Connection");

class Lembrete {

    async new (status, mensagem, idConsulta) {
        try {
            await knex.insert({ status, mensagem, id_tbl_consulta: idConsulta }).table('tbl_lembrete');

        } catch (err) {
            console.log(err);
        }
    }

    async findAll() {
        try {
            const result = await knex.select("*").table("tbl_lembrete");
            return result;
        } catch (err) {
            console.log(err);   
            return [];
        }
    }

    async findById(id){
        try {
            const result = await knex.select("*").where({ id: id }).table("tbl_lembrete");
            
            if(result.length > 0)
                return result[0];
            else
                return undefined;

        } catch (err) {
            console.log(err);   
            return [];
        }
    }

    async findByPaciente(id) {
        try {
            const result = await knex.select(["tbl_lembrete.id", "status", "mensagem"])
            .table("tbl_consulta")
            .innerJoin("tbl_lembrete", "tbl_lembrete.id_tbl_consulta", "=", "tbl_consulta.id")
            .whereRaw(`tbl_consulta.id_tbl_paciente = ${id}`);
            
            if(result.length > 0)
                return result;
            else
                return undefined;

        } catch (err) {
            console.log(err);   
            return [];
        }
    }

    async update(id, status, mensagem, idConsulta){
        const lembrete = await this.findById(id);

        if (lembrete != undefined){
            const editLembrete = {};

            editLembrete.status = status || lembrete.status;
            editLembrete.mensagem = mensagem || lembrete.mensagem;
            editLembrete.id_tbl_consulta = idConsulta || lembrete.id_tbl_consulta;

            try {
                await knex.update(editLembrete).where({ id: id }).table("tbl_lembrete");
                return { status: true }
            } catch (err) {
                return { status: false, err: err }
            }

        } else
            return { status : false, err: "O lembrete não existe." };
    }

    async delete (id){
        const lembrete = await this.findById(id);

        if (lembrete != undefined){
            try {
                await knex.delete().where({ id: id }).table("tbl_lembrete");
                return { status: true }
            }
            catch (err) {
                return { status: false, err: err }  
            }
                
        } else 
            return { status: false, err: "Não existe lembrete cadastrado, portanto não pode ser deletada." }    
   }
}

module.exports = new Lembrete();
