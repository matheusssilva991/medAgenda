const knex = require("../databases/Connection");
const EnderecoModel = require("./Endereco");
const UserModel = require("./User");
const TelefoneModel = require("./Telefone");
const MedicoModel = require("./Medico");

class Clinica {

    async new (nome, cnes, endereco, telefone, user) {
        try {
            
            // Cria ou não o endereco pega o seu id
            if (!await EnderecoModel.checkExists(endereco)) {
                const { rua, bairro, numero, complemento, cidade } = endereco;
                await EnderecoModel.new(rua, bairro, numero, complemento, cidade);
            }
            const id_tbl_endereco = await EnderecoModel.getId(endereco.rua, endereco.bairro, endereco.numero);

            const { ddd, numero } = telefone;
            await TelefoneModel.new(ddd, numero);
            const id_tbl_telefone = await TelefoneModel.getId(telefone.ddd, telefone.numero);
            
            // Cria o usuário e pegar o seu id
            const { email, senha } = user;
            await UserModel.new(email, senha, 1);
            let id_tbl_user = await UserModel.findByEmail(user.email);
            id_tbl_user = id_tbl_user.id;

            // Cria o clinica
            await knex.insert({ nome, cnes, id_tbl_endereco, id_tbl_telefone, id_tbl_user}).table('tbl_clinica');
 
        } catch (err) {
            console.log(err);
        }
    }

    async findAll() {
        try {
            // To Do - Criar View view_clinica_telefone_endereco
            const result = await knex
                .select("tbl_clinica.id", "nome", "cnes", "email", "ddd", "tbl_telefone.numero as numeroTelefone", 
                "rua", "bairro", "tbl_endereco.numero as numeroCasa", "complemento", "cidade",
                "nivel_permissao as nivelPermissao").from("tbl_clinica")
                .innerJoin("tbl_telefone", "tbl_clinica.id_tbl_telefone", "=", "tbl_telefone.id")
                .innerJoin("tbl_endereco", "tbl_clinica.id_tbl_endereco", "=", "tbl_endereco.id")
                .innerJoin("tbl_user", "tbl_clinica.id_tbl_user", "=", "tbl_user.id")
                .orderBy("id", "asc"); 
            return result;
        } catch (err) {
            console.log(err);   
            return [];
        }
    }

    async findById(id){
        try {
            const result = await knex
                .select("tbl_clinica.id", "nome", "cnes", "email", "ddd", "tbl_telefone.numero as numeroTelefone", 
                "rua", "bairro", "tbl_endereco.numero as numeroCasa", "complemento", "cidade",
                "nivel_permissao as nivelPermissao").from("tbl_clinica")
                .innerJoin("tbl_telefone", "tbl_clinica.id_tbl_telefone", "=", "tbl_telefone.id")
                .innerJoin("tbl_endereco", "tbl_clinica.id_tbl_endereco", "=", "tbl_endereco.id")
                .innerJoin("tbl_user", "tbl_clinica.id_tbl_user", "=", "tbl_user.id").orderBy("id", "asc")
                .whereRaw(`tbl_clinica.id = ${id}`);
            
            if(result.length > 0)
                return result[0];
            else
                return undefined;

        } catch (err) {
            console.log(err);   
            return [];
        }
    }

    async findByEmail(email){
        try {
            const result = await knex
                .select("tbl_clinica.id", "nome", "cnes", "email", "senha", "ddd", 
                "tbl_telefone.numero as numeroTelefone", "rua", "bairro", "tbl_endereco.numero as numeroCasa", 
                "complemento", "cidade", "nivel_permissao as nivelPermissao").from("tbl_clinica")
                .innerJoin("tbl_telefone", "tbl_clinica.id_tbl_telefone", "=", "tbl_telefone.id")
                .innerJoin("tbl_endereco", "tbl_clinica.id_tbl_endereco", "=", "tbl_endereco.id")
                .innerJoin("tbl_user", "tbl_clinica.id_tbl_user", "=", "tbl_user.id").orderBy("id", "asc")
                .whereRaw(`email = ${email}`);
            
            if(result.length > 0)
                return result[0];
            else
                return undefined;

        } catch (err) {
            console.log(err);   
            return [];
        }
    }

    async cnesExists(cnes) {
        try {
            const result = await knex.select("*").from("tbl_clinica").where({ cnes });

            if (result.length > 0)
                return true;
            else
                return false;
        } catch (err) {
            console.log(err);
            return false
        }
    }

    async update(id, nome, cnes, endereco, telefone, user){
        const clinica = await this.findById(id);

        if (clinica != undefined){
            const editClinica = {};

            // Verifica se o cnes não é undefined e atualiza caso já não exista
            if(cnes != undefined){
                if(cnes != clinica.cnes){
                    const result = await this.cnesExists(cnes);

                    if (result)
                        return { status: false, err: "O cnes já está cadastrado." };

                    editClinica.cnes = cnes || clinica.cnes;
                }
            }

            // Atualiza a clinica
            editClinica.nome = nome || clinica.nome;

            try {
                await knex.update(editClinica).where({id: id}).table("tbl_clinica");
            } catch (err) {
                return { status: false, err: err }
            }

            // Atualiza o endereco
            const idEndereco = await EnderecoModel.getId(clinica.rua, clinica.bairro, clinica.numeroCasa)
            const enderecoCheck = await EnderecoModel.findById(idEndereco);

            if (enderecoCheck != undefined) {
                const result = await EnderecoModel
                                        .update(enderecoCheck.id, endereco.rua, endereco.bairro, endereco.numero, 
                                                endereco.complemento, endereco.cidade);  

                if (!result.status)
                    return { status: false, err: result.err};
            }

            // Atualiza o telefone 
            const idTelefone = await TelefoneModel.getId(clinica.ddd, clinica.numeroTelefone)
            const telefoneCheck = await TelefoneModel.findById(idTelefone);

            if (telefoneCheck != undefined) {
                if(telefone.numero != clinica.numeroTelefone){
                    const telefoneExists = await this.checkExists({ddd: telefone.ddd, numero: telefone.numero});

                    if (telefoneExists)
                        return { status: false, err: "Já existe clinica cadastrada com este telefone." };

                    telefone.numero = telefone.numero || clinica.numeroTelefone;
                    telefone.ddd = telefone.ddd || clinica.ddd
                }

                const result = await TelefoneModel.update(telefoneCheck.id, telefone.ddd, telefone.numero); 

                if (!result.status)
                    return { status: false, err: result.err};
            }

            // Atualizar o user
            const userCheck = await UserModel.findByEmail(clinica.email);

            if (userCheck != undefined) {
                const result = await UserModel.update(userCheck.id, user.email, user.senha, user.nivelPermissao); 

                if (!result.status)
                    return { status: false, err: result.err};
            }

            return { status: true }

        } else
            return { status : false, err: "A clinica não existe." };
    }

    async delete (id){
        const clinica = await this.findById(id);

        if (clinica != undefined){
            const user = await UserModel.findByEmail(clinica.email);
            const idTelefone = await TelefoneModel.getId(clinica.ddd, clinica.numeroTelefone);

            try {
                await knex.delete().where({ id: id }).table("tbl_clinica");
                await UserModel.delete(user.id);
                await TelefoneModel.delete(idTelefone);
                return { status: true }
            }
            catch (err) {
                return { status: false, err: err }  
            }
                
        } else 
            return { status: false, err: "A clinica não existe, portanto não pode ser deletada." }    
   }
}

module.exports = new Clinica();
