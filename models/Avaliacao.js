const knex = require("../databases/Connection");

class Avaliacao {

    async new (nota, comentario, idConsulta) {
        try {
            await knex.insert({ nota, comentario, id_tbl_consulta: idConsulta }).table('tbl_avaliacao');

        } catch (err) {
            console.log(err);
        }
    }

    async findAll() {
        try {
            const result = await knex.select("*").table("tbl_avaliacao");
            return result;
        } catch (err) {
            console.log(err);   
            return [];
        }
    }

    async findById(id){
        try {
            const result = await knex.select("*").where({ id: id }).table("tbl_avaliacao");
            
            if(result.length > 0)
                return result[0];
            else
                return undefined;

        } catch (err) {
            console.log(err);   
            return [];
        }
    }

    async findByMedico(id) {
        try {
            const result = await knex.select(["tbl_avaliacao.id", "nota", "comentario"])
            .table("tbl_consulta")
            .innerJoin("tbl_avaliacao", "tbl_avaliacao.id_tbl_consulta", "=", "tbl_consulta.id")
            .whereRaw(`tbl_consulta.id_tbl_medico = ${id}`);
            
            if(result.length > 0)
                return result;
            else
                return undefined;

        } catch (err) {
            console.log(err);   
            return [];
        }
    }

    async update(id, nota, comentario, idConsulta){
        const avaliacao = await this.findById(id);

        if (avaliacao != undefined){
            const editAvaliacao = {};

            editAvaliacao.nota = nota || avaliacao.nota;
            editAvaliacao.comentario = comentario || avaliacao.comentario;
            editAvaliacao.id_tbl_consulta = idConsulta || avaliacao.id_tbl_consulta;

            try {
                await knex.update(editAvaliacao).where({ id: id }).table("tbl_avaliacao");
                return { status: true }
            } catch (err) {
                return { status: false, err: err }
            }

        } else
            return { status : false, err: "A avaliação não existe." };
    }

    async delete (id){
        const avaliacao = await this.findById(id);

        if (avaliacao != undefined){
            try {
                await knex.delete().where({ id: id }).table("tbl_avaliacao");
                return { status: true }
            }
            catch (err) {
                return { status: false, err: err }  
            }
                
        } else 
            return { status: false, err: "Não existe avaliação cadastrada, portanto não pode ser deletada." }    
   }
}

module.exports = new Avaliacao();
