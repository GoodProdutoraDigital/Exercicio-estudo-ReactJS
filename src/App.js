import './App.css';

import {useState, useEffect} from 'react'
import {BsTrash, BsBookmarkCheck, BsBookmarkCheckFill} from 'react-icons/bs'

const API = 'http://localhost:5000'

function App() {
  /* States da aplicação */
  /* Titulo Tarefa*/
  const [tittle, setTittle] = useState('')
  /* Horario da Tarefa */
  const [time, setTime] = useState('')
  /* array de Tarefas */
  const [todos, setTodos] = useState([])
  /* Loading */
  const [loading, setLoading] = useState(false)

  /* load todo ao carregar a pagina */
  useEffect(() => {
    const loadData = async() => {
      setLoading(true)
      
      const res = await fetch(API + "/todosList")
      /* esperar uma resposta e trasforma la em json */
      .then((res) => res.json())
      /* obtem a resposta e retorna os dados no array de objetos */
      .then((data) => data)
      .catch((error) => console.log(error))

      /* setar loading como false ao finalizar */
      setLoading(false)

      /* setar os dados recebidos em json trasformados em array de objetos */
      setTodos(res)
    }
    /* executar a função ao carregar a pagina */
    loadData()
  }, [])


  /* requisição assincrona */
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const todo = {
      id: Math.random(),
      tittle,
      time,
      done: false
    }
    
    /* Envio para API utilizando fech nativo do Javascript*/
    await fetch(API + "/todosList", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json"
      }
    })

    /* Acessando o estado anterioir com o prevState */
    /* adicionando o novo item no estado anterior e gerando um novo estado */
    setTodos((prevState) => [...prevState, todo])

    setTime('')
    setTittle('')

  }

  const handleDelete = async (id) => {
    await fetch(API + "/todosList/" + id, {
      method: "DELETE",
    })

    /* Comparação com id da requisição com uso do método  filter */
    setTodos((prevState) => prevState.filter((todo) => todo.id !== id))
  }

  const handleEdit = async (todo) => {
    todo.done = !todo.done
    const data = await fetch(API + "/todosList/" + todo.id, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json"
      }
    })

    /* verifica se o id do todo é igual ao id da API */
    /* caso sim substitue pelo valor da API, se não permanece igual */
    setTodos((prevState) => 
    prevState.map((t) => (t.id === data.id ? (t = data) : t))
    )
  }

  if(loading){
    return <p>Carregando...</p>
  }

  return (
    <div className="App">
      <div className="todo-header">
        <h1>React TodoList</h1>
      </div>
      <div className="form-todo">
        <h2>Insira sua próxima tarefa</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor='tittle'>Qual a tarefa ?</label>
            <input 
              type="text" 
              name="tittle" 
              placeholder='Titulo da tarefa'
              /* e(evento) setTitte(useState) target(imput) value(inserindo o valor recebido no input) */
              onChange={(e) => setTittle(e.target.value)} 
              value={tittle || ''}
              /* inicia com value vazio */
              required>
            </input>
          </div>
          <div className="form-control">
            <label htmlFor='time'>Duração: </label>
            <input 
              type="text" 
              name="time" 
              placeholder='Tempo estimado em horas'
              /* e(evento) setTitte(useState) target(input) value(inserindo o valor recebido no input) */
              onChange={(e) => setTime(e.target.value)} 
              value={time || ''}
              /* inicia com value vazio */
              required>
            </input>
          </div>
          <input type="submit" value="Criar Tarefa"></input>
         
        </form>
      </div>
      <div className="list-todo">
        <h2>Lista de tarefas:</h2>
        {/* Renderização condicional */}
        {/* propriedade array length (especifíca o número de elementos em um array */}
        {todos.length === 0 && <p>Não existem tarefas!</p>}
        {/* Uso do método map jutamente com um parâmetro de função para percorrer cada um dos itens*/}
        {todos.map((todo) => (
          <div className='todo' key={todo.id}>
            {/* setando a classe caso o todo esteja feito, se não será vazia */}
            <h3 className={todo.done ? 'todo-done' : ''}>{todo.tittle}</h3>
            <p>Duração: {todo.time}</p>
            <div className='actions'>
              <span onClick={() => handleEdit(todo)}>
                {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
              </span>
              {/* necessário o uso de arrow function para que a função sera realizada ao efetuar o click */}
              <BsTrash onClick={() => handleDelete(todo.id)}></BsTrash>
            </div>
          </div>          
        ))}
      </div>
    </div>
  );
}

export default App;