const HorarioAtendimento = require("../models/HorarioAtendimento");
const Consulta = require("../models/Consulta");
const Medico = require("../models/Medico");
const Paciente = require("../models/Paciente");

class ConsultaController {

    async index (req, res) {
        const consultas = await Consulta.findAll();
        res.json(consultas);
        return;
    }

    async findConsulta(req, res){
        const id = req.params.id;
        const consulta = await Consulta.findById(id);

        if(consulta == undefined){
            res.status(404); // Not finding
            res.json({});
            return;
        } else {
            res.status(200) // Sucess
            res.json(consulta);
            return;
        }
    }

    async findMedicoConsultas(req, res){
        const id = req.params.id;
        const consultas = await Consulta.findByMedico(id);

        res.status(200).json(consultas);
        return;
    }

    async findPacienteConsultas(req, res){
        const id = req.params.id;
        const consultas = await Consulta.findByPaciente(id);

        res.status(200).json(consultas);
        return;
    }

    async create(req, res){
        const { data, horarioInicio, horarioFim, idPaciente, idMedico } = req.body;

        if (!await HorarioAtendimento.isHorarioLivre(idMedico, data, horarioInicio, horarioFim)){
            res.status(400).json({ err: "O horário não está livre!." });
            return;
        }

        const paciente = await Paciente.findById(idPaciente);
        const medico = await Medico.findById(idMedico);

        if (paciente == undefined) {
            res.status(400).json({ err: "Paciente não existe!." });
            return;
        }

        if (medico == undefined) {
            res.status(400).json({ err: "Medico não existe!." });
            return;
        }

        await Consulta.new(data, horarioInicio, horarioFim, idPaciente, idMedico);

        res.status(200);
        res.send("Tudo Ok!");
        return;
    }

    async edit(req, res){
        const id = req.params.id;
        const { data, horarioInicio, horarioFim, idPaciente, idMedico } = req.body;
        const consulta = Consulta.findById(id);

        if (consulta == undefined) {
            res.status(406).send("A consulta não existe");
            return;
        }

        const paciente = await Paciente.findById(idPaciente);
        const medico = await Medico.findById(idMedico);

        if (medico == undefined) {
            res.status(400).json({ err: "Medico não existe!." });
            return;
        }

        if (paciente == undefined) {
            res.status(400).json({ err: "Paciente não existe!." });
            return;
        }

        if (!await HorarioAtendimento.isHorarioLivre(idMedico, data, horarioInicio, horarioFim)){
            res.status(400).json({ err: "O horário não está livre!." });
            return;
        }

        const result = await Consulta.update(id, data, horarioInicio, horarioFim, idPaciente, idMedico);

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
        const result = await Consulta.delete(id);

        if (result.status){
            res.status(200);
            res.send("Tudo OK!");
        } else {
            res.status(406);
            res.send(result.err);
        }
    }
}

module.exports = new ConsultaController();
