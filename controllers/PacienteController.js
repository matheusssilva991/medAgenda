const Paciente = require("../models/Paciente");
const User = require("../models/User");
const dotenv = require("dotenv").config();
const validator = require("validator");

class PacienteController {

    async index (req, res) {
        const pacientes = await Paciente.findAll();
        res.json(pacientes);
        return;
    }

    async findPaciente(req, res){
        const id = req.params.id;
        const paciente = await Paciente.findById(id);

        if(paciente == undefined){
            res.status(404); // Not finding
            res.json({});
            return;
        } else {
            res.status(200) // Sucess
            res.json(paciente);
            return;
        }
    }

    async create(req, res){
        const { nome, cpf, dataNascimento } = req.body;

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

        const cpfExists = await Paciente.cpfExists(cpf);
        if (cpfExists){
            res.status(406);
            res.json({ err: "O cpf já está cadastrado!." });
            return;
        }

        if (!validator.isStrongPassword(senha)) {
            res.status(400);
            res.json({ err: "Senha fraca!." });
            return;
        }

        await Paciente.new(nome, cpf, dataNascimento, endereco, telefone, user);

        res.status(200);
        res.send("Tudo Ok!");
        return;
    }

    async edit(req, res){
        const id = req.params.id;
        const { nome, cpf, dataNascimento } = req.body;

        const { rua, bairro, numeroCasa, complemento, cidade } = req.body;
        const endereco = { rua, bairro, numero: numeroCasa, complemento, cidade };

        const { ddd, numeroTelefone } = req.body;
        const telefone = { ddd, numero: numeroTelefone };

        const { email, senha } = req.body;
        const user = { email, senha };
        
        const result = await Paciente.update(id, nome, cpf, dataNascimento, endereco, telefone, user);

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
        const result = await Paciente.delete(id);

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

module.exports = new PacienteController();
