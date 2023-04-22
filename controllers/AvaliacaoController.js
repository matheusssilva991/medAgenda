const Avaliacao = require("../models/Avaliacao");
const Consulta = require("../models/Consulta");

class AvaliacaoController {

    async index (req, res) {
        const avaliacoes = await Avaliacao.findAll();
        res.json(avaliacoes);
        return;
    }

    async findAvaliacao(req, res){
        const id = req.params.id;
        const avaliacao = await Avaliacao.findById(id);

        if(avaliacao == undefined){
            res.status(404); // Not finding
            res.json({});
            return;
        } else {
            res.status(200) // Sucess
            res.json(avaliacao);
            return;
        }
    }

    async findMedicoAvaliacoes(req, res){
        const id = req.params.id;
        const avaliacoes = await Avaliacao.findByMedico(id);

        res.status(200).json(avaliacoes);
        return;
    }

    async create(req, res){
        const { nota, comentario, idConsulta } = req.body;
        const consulta = Consulta.findById(idConsulta)
        
        if (consulta == undefined){
            res.status(406).send("A consulta não existe");
            return;
        }

        await Avaliacao.new(nota, comentario, idConsulta);

        res.status(200);
        res.send("Tudo Ok!");
        return;
    }

    async edit(req, res){
        const id = req.params.id;
        const { nota, comentario, idConsulta } = req.body;
        const consulta = Consulta.findById(id);

        if (consulta == undefined) {
            res.status(406).send("A consulta não existe");
            return;
        }

        const result = await Avaliacao.update(id, nota, comentario, idConsulta );

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
        const result = await Avaliacao.delete(id);

        if (result.status){
            res.status(200);
            res.send("Tudo OK!");
        } else {
            res.status(406);
            res.send(result.err);
        }
    }
}

module.exports = new AvaliacaoController();

