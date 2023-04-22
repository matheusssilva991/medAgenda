const Lembrete = require("../models/Lembrete");
const Consulta = require("../models/Consulta");

class LembreteController {

    async index (req, res) {
        const lembretes = await Lembrete.findAll();
        res.json(lembretes);
        return;
    }

    async findLembrete(req, res){
        const id = req.params.id;
        const lembrete = await Lembrete.findById(id);

        if(lembrete == undefined){
            res.status(404); // Not finding
            res.json({});
            return;
        } else {
            res.status(200) // Sucess
            res.json(lembrete);
            return;
        }
    }

    async findPacienteLembretes(req, res){
        const id = req.params.id;
        const consultas = await Lembrete.findByPaciente(id);

        res.status(200).json(consultas);
        return;
    }

    async create(req, res){
        const { status, mensagem, idConsulta } = req.body;
        const consulta = Consulta.findById(idConsulta)
        
        if (consulta == undefined){
            res.status(406).send("A consulta não existe");
            return;
        }

        await Lembrete.new(status, mensagem, idConsulta);

        res.status(200);
        res.send("Tudo Ok!");
        return;
    }

    async edit(req, res){
        const id = req.params.id;
        const { status, mensagem, idConsulta } = req.body;
        const consulta = Consulta.findById(id);

        if (consulta == undefined) {
            res.status(406).send("A consulta não existe");
            return;
        }

        const result = await Lembrete.update(id, status, mensagem, idConsulta );

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
        const result = await Lembrete.delete(id);

        if (result.status){
            res.status(200);
            res.send("Tudo OK!");
        } else {
            res.status(406);
            res.send(result.err);
        }
    }
}

module.exports = new LembreteController();
