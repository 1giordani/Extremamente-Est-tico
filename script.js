const STORAGE_KEY = "estudo-facil-tarefas";
let tarefas = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

const form = document.querySelector("#taskForm");
const taskInput = document.querySelector("#task");
const subjectInput = document.querySelector("#subject");
const list = document.querySelector("#taskList");
const empty = document.querySelector("#empty");

function salvar() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tarefas));
}

function atualizarIndicadores() {
  const concluidas = tarefas.filter(tarefa => tarefa.concluida).length;
  document.querySelector("#total").textContent = tarefas.length;
  document.querySelector("#concluidas").textContent = concluidas;
  document.querySelector("#progresso").textContent = tarefas.length
    ? `${Math.round((concluidas / tarefas.length) * 100)}%`
    : "0%";
}

function renderizar() {
  list.innerHTML = "";
  empty.hidden = tarefas.length > 0;

  tarefas.forEach((tarefa, indice) => {
    const item = document.createElement("li");
    if (tarefa.concluida) item.classList.add("done");

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = tarefa.concluida;
    check.setAttribute("aria-label", `Concluir ${tarefa.nome}`);
    check.addEventListener("change", () => {
      tarefas[indice].concluida = check.checked;
      salvar();
      renderizar();
    });

    const content = document.createElement("div");
    content.className = "task-text";
    content.innerHTML = `<strong>${escapeHtml(tarefa.nome)}</strong><br><span class="subject">${escapeHtml(tarefa.materia)}</span>`;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "secondary";
    remove.textContent = "Excluir";
    remove.addEventListener("click", () => {
      tarefas.splice(indice, 1);
      salvar();
      renderizar();
    });

    item.append(check, content, remove);
    list.appendChild(item);
  });

  atualizarIndicadores();
}

function escapeHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const nome = taskInput.value.trim();
  if (!nome) return;

  tarefas.push({ nome, materia: subjectInput.value, concluida: false });
  salvar();
  form.reset();
  taskInput.focus();
  renderizar();
});

document.querySelector("#limpar").addEventListener("click", () => {
  tarefas = tarefas.filter(tarefa => !tarefa.concluida);
  salvar();
  renderizar();
});

renderizar();
