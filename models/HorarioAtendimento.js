const knex = require("../databases/Connection");
const Consulta = require("../models/Consulta");

class HorarioAtendimento {

    async new (diaSemana, dataInicio, dataFim, horarioInicio, horarioFim, idMedico) {
        try {
            await knex.insert({ dia_semana: diaSemana, data_inicio: dataInicio, data_fim: dataFim, 
                                horario_inicio: horarioInicio, horario_fim: horarioFim, id_tbl_medico: idMedico })
                      .table('tbl_horario_atendimento');

        } catch (err) {
            console.log(err);
        }
    }

    async findAll() {
        try {
            const result = await knex.select("*").table("tbl_horario_atendimento").orderBy("id_tbl_medico", "asc");
            return result;
        } catch (err) {
            console.log(err);   
            return [];
        }
    }

    async findById(id){
        try {
            const result = await knex.select("*").where({ id: id }).table("tbl_horario_atendimento");
            
            if(result.length > 0)
                return result[0];
            else
                return undefined;

        } catch (err) {
            console.log(err);   
            return [];
        }
    }

    async findByMedico(idMedico) {
        try {
            let result = await this.findAll();
            result = result.filter(horarioAtendimento => horarioAtendimento.id_tbl_medico == idMedico);;

            return result;
        } catch(err) {
            console.log(err);   
            return [];
        }
    }

    async isHorarioLivre(idMedico, data, horarioInicio, horarioFim) {
        let now = new Date().toLocaleString("pt-BR", {timeZone: "America/Bahia"})
        now = new Date(now.split(",")[0].split("/").reverse().join("-"));
        data = new Date(data.split(",")[0].split("/").reverse().join("-"));

        let horariosAtendi = await this.findByMedico(idMedico);

        horariosAtendi = horariosAtendi.filter(horarioAtendimento => {
            return horarioAtendimento.data_fim > now && horarioAtendimento.dia_semana == data.getDay() &&
                   horarioAtendimento.horario_inicio <= horarioInicio && 
                   horarioAtendimento.horario_fim >= horarioFim ;
        });

        if (horariosAtendi.length == 0){
            return false;
        }

        let medicoConsultas = await Consulta.findByMedico(idMedico);
        medicoConsultas = medicoConsultas.filter(consulta => consulta.data.getUTCDate() == data.getUTCDate());
        medicoConsultas = medicoConsultas.filter(consulta => {
            return (consulta.horario_inicio <= horarioInicio && consulta.horario_fim > horarioInicio) ||
                   (consulta.horario_inicio < horarioFim && consulta.horario_fim >= horarioFim);
        })

        if (medicoConsultas.length > 0)
            return false;
        else
            return true
    }

    async update(id, diaSemana, dataInicio, dataFim, horarioInicio, horarioFim, idMedico){
        const horarioAtendimento = await this.findById(id);

        if (horarioAtendimento != undefined){
            const editHorarioAtendimento = {};

            editHorarioAtendimento.dia_semana = diaSemana || horarioAtendimento.dia_semana;
            editHorarioAtendimento.data_inicio = dataInicio || horarioAtendimento.data_inicio;
            editHorarioAtendimento.data_fim = dataFim || horarioAtendimento.data_fim;
            editHorarioAtendimento.horario_inicio = horarioInicio || horarioAtendimento.horario_inicio;
            editHorarioAtendimento.horario_fim = horarioFim || horarioAtendimento.horario_fim;
            editHorarioAtendimento.id_tbl_medico = idMedico || horarioAtendimento.id_tbl_medico; 

            console.log(editHorarioAtendimento);

            try {
                await knex.update(editHorarioAtendimento).where({ id: id }).table("tbl_horario_atendimento");
                return { status: true }
            } catch (err) {
                return { status: false, err: err }
            }

        } else
            return { status : false, err: "O horario de atendimento não existe." };
    }

    async delete (id){
        const horarioAtendimento = await this.findById(id);

        if (horarioAtendimento != undefined){
            try {
                await knex.delete().where({ id: id }).table("tbl_horario_atendimento");
                return { status: true };
            }
            catch (err) {
                return { status: false, err: err } ;
            }
                
        } else 
            return { status: false, err: "Não existe horario de atendimento cadastrado."}
   }

    async deleteMedicoHorariosAtendimento(idMedico) {
        try {
            await knex.delete().where({id_medico: idMedico}).table("tbl_horario_atendimento");
            return { status: true };
        } catch (err) {
            return { status: false, err: err }; 
        }
    }
}

module.exports = new HorarioAtendimento();
