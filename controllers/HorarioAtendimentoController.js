const HorarioAtendimento = require("../models/HorarioAtendimento");
const dotenv = require("dotenv").config();

class HorarioAtendimentoController {

    async index (req, res) {
        const horariosAtendimento = await HorarioAtendimento.findAll();
        res.json(horariosAtendimento);
        return;
    }

    async findHorarioAtendimento(req, res){
        const id = req.params.id;
        const horarioAtendimento = await HorarioAtendimento.findById(id);

        if(horarioAtendimento == undefined){
            res.status(404); // Not finding
            res.json({});
            return;
        } else {
            res.status(200) // Sucess
            res.json(horarioAtendimento);
            return;
        }
    }

    async findMedicoHorariosAtendimento(req, res){
        const id = req.params.id;
        const horariosAtendimento = await HorarioAtendimento.findByMedico(id);

        res.json(horariosAtendimento);
        return;
    }

    async create(req, res){
        let { diaSemana, dataInicio, dataFim, horarioInicio, horarioFim, idMedico } = req.body;
        const medico = await HorarioAtendimento.findById(idMedico);

        dataInicio = new Date(dataInicio.split("/").reverse().join("-"));
        dataFim = new Date(dataFim.split("/").reverse().join("-"));

        let now = new Date().toLocaleString("pt-BR", {timeZone: "America/Bahia"})
        now = new Date(now.split(",")[0].split("/").reverse().join("-"));

        if (medico == undefined) {
            res.status(406).send("O medico não existe");
            return;
        }
    
        if (diaSemana < 0 || diaSemana > 6){
            res.status(400).json({ err: "Dia da semana inválido" });
            return;
        }

        if (dataInicio < now || dataFim < now || dataFim <= dataInicio){
            res.status(400).json({ err: "Data(s) inválida(s)." });
            return;
        }

        if (horarioInicio < 0 || horarioInicio > 24 || horarioFim < 0 || horarioFim > 24){
            res.status(400).json({ err: "Horario(s) inválido(s)." });
            return;
        }

        await HorarioAtendimento.new(diaSemana, dataInicio, dataFim, horarioInicio, horarioFim, idMedico);

        res.status(200);
        res.send("Tudo Ok!");
        return;
    }

    async edit(req, res){
        const id = req.params.id;
        let { diaSemana, dataInicio, dataFim, horarioInicio, horarioFim, idMedico } = req.body;
        const medico = await HorarioAtendimento.findById(idMedico);

        dataInicio = new Date(dataInicio.split("/").reverse().join("-"));
        dataFim = new Date(dataFim.split("/").reverse().join("-"));
        
        let now = new Date().toLocaleString("pt-BR", {timeZone: "America/Bahia"})
        now = new Date(now.split(",")[0].split("/").reverse().join("-"));

        if (medico == undefined) {
            res.status(406).send("O medico não existe");
            return;
        }
    
        if (diaSemana < 0 || diaSemana > 6){
            res.status(400).json({ err: "Dia da semana inválido" });
            return;
        }

        if (dataInicio < now || dataFim < now || dataFim <= dataInicio){
            res.status(400).json({ err: "Data(s) inválida(s)." });
            return;
        }

        if (horarioInicio < 0 || horarioInicio > 24 || horarioFim < 0 || horarioFim > 24){
            res.status(400).json({ err: "Horario(s) inválido(s)." });
            return;
        }

        const result = await HorarioAtendimento.update(id, diaSemana, dataInicio, dataFim, horarioInicio, 
                                                        horarioFim, idMedico);

        if (result != undefined){
            if (result.status){
                res.status(200);
                res.send("Tudo OK.");
                return;
            } else {
                res.status(406);
                res.send(result.err);
                return;
            }
        } else {
            res.status(406);
            res.send("Ocorreu um error no servidor!");
        }
    }

    async remove (req, res) {
        const id = req.params.id;
        const result = await HorarioAtendimento.delete(id);

        if (result.status){
            res.status(200);
            res.send("Tudo OK!");
        } else {
            res.status(406);
            res.send(result.err);
        }
    }
}

module.exports = new HorarioAtendimentoController();
