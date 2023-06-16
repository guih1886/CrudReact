import React from "react";
import { Component } from "react";
import Main from "../template/Main";
import axios from "axios";

const headerProps = {
    icon: 'users',
    title: 'Usuários',
    subtitle: 'Cadastro de Usuários: Incluir, Listar, Alterar e Excluir.'
}

const baseURL = 'http://localhost:3001/users'
const initialState = {
    user: { name: '', email: '' },
    list: [],
    disableEmail: false
}

export default class UserCrud extends Component {
    state = { ...initialState }
    id = 1

    componentWillMount() {
        axios(baseURL).then(resp => {
            this.setState({ list: resp.data })
        })
    }

    clear() {
        this.setState({ user: initialState.user })
    }

    save(e) {
        e.preventDefault(); // Evita que o formulário seja enviado

        let { name, email } = this.state.user;

        // Verifica se o nome e o email foram preenchidos
        if (!name || !email) {
            alert("Por favor, preencha o nome e o email.");
            return;
        }

        const userIndex = this.state.list.findIndex(
            (user) => user.email === email
        );

        if (userIndex !== -1) {
            // O usuário já existe na lista, então iremos atualizá-lo
            const updatedList = [...this.state.list];
            updatedList[userIndex] = { name, email };

            // Atualiza o estado com o novo usuário e a lista atualizada
            this.setState({ user: initialState.user, list: updatedList });
            console.log("entrou no if");
        } else {
            // O usuário não existe na lista, então iremos adicioná-lo
            const newUser = { name, email };
            const newList = [...this.state.list, newUser];

            // Atualiza o estado com o novo usuário e a lista atualizada
            this.setState({ user: initialState.user, list: newList });

            console.log('else');
        }
        this.setState({ disableEmail: false })
        const user = this.state.user
        const method = user.id ? 'put' : 'post'
        const url = user.id ? `${baseURL}/${user.id}` : baseURL
        axios[method](url, user).then(resp => {
            const list = this.getUpdatedList(resp.data)
            this.setState({ user: initialState.user, list })
        })
    }

    getUpdatedList(user, add = true) {
        const list = this.state.list.filter(u => u.id !== user.id)
        if (add) list.unshift(user)
        return list
    }

    updateField(event) {
        const user = { ...this.state.user }
        user[event.target.name] = event.target.value
        this.setState({ user })
    }

    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label className="pb-2">Nome</label>
                            <input type="text" className="form-control" name="name" value={this.state.user.name} onChange={e => this.updateField(e)} placeholder="Digite o nome: " />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label className="pb-2">E-mail</label>
                            <input disabled={this.state.disableEmail} type="text" className="form-control" name="email" value={this.state.user.email} onChange={e => this.updateField(e)} placeholder="Digite o e-mail: " />
                        </div>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary" onClick={e => this.save(e)}>
                            Salvar
                        </button>
                        <button className="btn btn-danger ml-5" onClick={e => this.clear(e)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    load(user) {
        this.setState({ user, disableEmail: true })
    }

    remove(user) {
        const newList = this.state.list.filter(usuario => usuario.email !== user.email)
        // Atualiza o estado com o novo usuário e a lista atualizada
        this.setState({ user: initialState.user, list: newList });
        axios.delete(`${baseURL}/${user.id}`).then(resp => {
            const list = this.getUpdatedList(user, false)
            this.setState({ list })
        })
    }

    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>

        )
    }

    renderRows() {
        return this.state.list.map(user => {
            return (
                <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                        <button className="btn btn-warning" onClick={() => this.load(user)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger ml-2" onClick={() => this.remove(user)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}