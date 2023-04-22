const knex = require("../databases/Connection");
const LembreteModel = require("./Lembrete");

class Consulta {

    async new (data, horarioInicio, horarioFim, idPaciente, idMedico) {
        try {
            await knex.insert({ data, horario_inicio: horarioInicio, horario_fim: horarioFim, 
                id_tbl_paciente: idPaciente, id_tbl_medico: idMedico }).table('tbl_consulta');

            let idConsulta = await knex.select("id").table("tbl_consulta").where({data, 
                horario_inicio: horarioInicio, horario_fim: horarioFim, id_tbl_paciente: idPaciente })
            idConsulta = idConsulta[0].id;

            data = new Date(data.split("/").reverse().join("-"));

            let now = new Date().toLocaleString("pt-BR", {timeZone: "America/Bahia"})
            now = new Date(now.split(",")[0].split("/").reverse().join("-"));

            //if (data - now >= 2)
               await LembreteModel.new("não visualizado", `Sua consulta está marcada para o dia ${data.toDateString()}`, idConsulta);        
        } catch (err) {
            console.log(err);
        }
    }

    async findAll() {
        try {
            const result = await knex.select("*").table("tbl_consulta");
            return result;
        } catch (err) {
            console.log(err);   
            return [];
        }
    }

    async findById(id){
        try {
            const result = await knex.select("*").where({ id: id }).table("tbl_consulta");
            
            if(result.length > 0)
                return result[0];
            else
                return undefined;

        } catch (err) {
            console.log(err);   
            return [];
        }
    }

    async findByMedico (id) {
        try {
            const consultas = await this.findAll();
            const result = consultas.filter(consulta => consulta.id_tbl_medico == id);

            return result;
        } catch(err) {
            console.log(err);   
            return [];
        }
    }

    async findByPaciente (id) {
        try {
            const consultas = await this.findAll();
            const result = consultas.filter(consulta => consulta.id_tbl_paciente == id);

            return result;
        } catch(err) {
            console.log(err);   
            return [];
        }
    }

    async update(id, data, horarioInicio, horarioFim, idPaciente, idMedico){
        const consulta = await this.findById(id);

        if (consulta != undefined){
            const editConsulta = {};

            console.log(horarioInicio, horarioFim)
            editConsulta.data = data || consulta.data;
            editConsulta.horario_inicio = horarioInicio || consulta.horario_inicio;
            editConsulta.horario_fim = horarioFim || consulta.horario_fim;
            editConsulta.id_tbl_paciente = idPaciente || consulta.id_tbl_paciente;
            editConsulta.id_tbl_medico = idMedico || consulta.id_tbl_medico; 

            console.log(editConsulta)
            try {
                await knex.update(editConsulta).where({ id: id }).table("tbl_consulta");
                return { status: true }
            } catch (err) {
                return { status: false, err: err }
            }

        } else
            return { status : false, err: "A consulta não existe." };
    }

    async delete (id){
        const consulta = await this.findById(id);

        if (consulta != undefined){
            try {
                await knex.delete().where({ id: id }).table("tbl_consulta");
                await knex.delete().where({id_tbl_consulta: id}).table("tbl_lembrete");

                const avaliacao = await knex.select("*").table("tbl_avaliacao").where({id_tbl_consulta: id});
                if (avaliacao != undefined)
                    await knex.delete().where({id_tbl_consulta: id}).table("tbl_avaliacao");

                return { status: true }
            }
            catch (err) {
                return { status: false, err: err }  
            }
                
        } else 
            return { status: false, err: "Não existe consulta cadastrada, portanto não pode ser deletada." }    
   }
}

module.exports = new Consulta();
