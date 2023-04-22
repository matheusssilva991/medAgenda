const Clinica = require("../models/Clinica");
const Telefone = require("../models/Telefone");
const User = require("../models/User");
const HorarioAtendimento = require("../models/HorarioAtendimento");
const validator = require("validator");

class ClinicaController {

    async index (req, res) {
        const clinicas = await Clinica.findAll();
        res.json(clinicas);
        return;
    }

    async findClinica(req, res){
        const id = req.params.id;
        const clinica = await Clinica.findById(id);

        if(clinica == undefined){
            res.status(404); // Not finding
            res.json({});
            return;
        } else {
            res.status(200) // Sucess
            res.json(clinica);
            return;
        }
    }

    async create(req, res){
        const { nome, cnes } = req.body;

        const { rua, bairro, numeroCasa, complemento, cidade } = req.body;
        const endereco = { rua, bairro, numero: numeroCasa, complemento, cidade };

        const { ddd, numeroTelefone } = req.body;
        const telefone = { ddd, numero: numeroTelefone };

        const { email, senha } = req.body;
        const user = { email, senha };
        
        if(!validator.isEmail(email)){
            res.status(400);
            res.json({ err: "O e-mail é invalido!." });
            return;
        }

        const emailExists = await User.emailExists(email);
        if (emailExists){
            res.status(406);
            res.json({ err: "O e-mail já está cadastrado!." });
            return;
        }

        const cnesExists = await Clinica.cnesExists(cnes);
        if (cnesExists){
            res.status(406);
            res.json({ err: "O cnes já está cadastrado!." });
            return;
        }

        const telefoneExists = await Telefone.checkExists({ ddd, numero: numeroTelefone });
        if (telefoneExists){
            res.status(406);
            res.json({ err: "já existe clinica cadastrada com este telefone" });
            return;
        }

        if (!validator.isStrongPassword(senha)) {
            res.status(400);
            res.json({ err: "Senha fraca!." });
            return;
        }

        await Clinica.new(nome, cnes, endereco, telefone, user);

        res.status(200);
        res.send("Tudo Ok!");
        return;
    }

    async edit(req, res){
        const id = req.params.id;
        const { nome, cnes } = req.body;

        const { rua, bairro, numeroCasa, complemento, cidade } = req.body;
        const endereco = { rua, bairro, numero: numeroCasa, complemento, cidade };

        const { ddd, numeroTelefone } = req.body;
        const telefone = { ddd, numero: numeroTelefone };

        const { email, senha } = req.body;
        const user = { email, senha };
        
        const result = await Clinica.update(id, nome, cnes, endereco, telefone, user);

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
            return;
        }
    }

    async remove (req, res) {
        const id = req.params.id;
        const result = await Clinica.delete(id);

        if (result.status){
            res.status(200);
            res.send("Tudo OK!");
            return;
        } else {
            res.status(406);
            res.send(result.err);
            return;
        }
    }
}

module.exports = new ClinicaController();
