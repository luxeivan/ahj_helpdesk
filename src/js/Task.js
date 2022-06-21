export default class Task {
    constructor(areaTask, areaForModal) {
        this.areaTask = document.querySelector('.' + areaTask);
        this.areaForModal = document.querySelector('.' + areaForModal);
        this.init();
    }
    init() {
        this.requestAllTicket();
    }

    renderTaskList(arrTask) {
        //Создать кнопку
        const buttonAddTask = document.createElement('button');
        buttonAddTask.classList.add('add_task_button');
        buttonAddTask.innerText = 'Add Task';
        buttonAddTask.addEventListener('click', () => {
            this.areaForModal.innerHTML = '';
            this.areaForModal.classList.toggle('active');

            const formNewTicket = document.createElement('form');
            formNewTicket.classList.add('form_new_ticket');

            const nameNewTicket = document.createElement('input');
            nameNewTicket.classList.add('name_new_ticket');

            const descriptionNewTicket = document.createElement('textarea');
            descriptionNewTicket.classList.add('description_new_ticket');

            const createNewTicket = document.createElement('button');
            createNewTicket.innerText = 'Создать';
            createNewTicket.classList.add('create_new_ticket');
            createNewTicket.addEventListener('click', evt => {
                evt.preventDefault();
                this.addTicket(nameNewTicket.value, descriptionNewTicket.value);
                this.areaForModal.classList.toggle('active');
            });

            const cancelNewTicket = document.createElement('button');
            cancelNewTicket.innerText = 'Отменить';
            cancelNewTicket.addEventListener('click', evt => {
                evt.preventDefault();
                this.areaForModal.classList.toggle('active');
            });

            formNewTicket.append(nameNewTicket);
            formNewTicket.append(descriptionNewTicket);
            formNewTicket.append(cancelNewTicket);
            formNewTicket.append(createNewTicket);

            this.areaForModal.append(formNewTicket);

        });

        //Создать список задач
        const listtask = document.createElement('ul');
        listtask.classList.add('task_list');

        //Добавить задачи в список
        arrTask.forEach(element => {
            const li = document.createElement('li');
            li.addEventListener('click',(evt)=>{
                if(evt.target == li){
                    this.requestTicket(element.id);
                }
                
            });

            //Добавить кнопку редактировать
            const buttonEdit = document.createElement('button');
            buttonEdit.innerText = '\u270E';
            buttonEdit.classList.add('task_button');
            buttonEdit.dataset.id = element.id;

            //Добавить кнопку удалить
            const buttonDel = document.createElement('button');
            buttonDel.innerText = '\u2716'
            buttonDel.classList.add('task_button');
            buttonDel.dataset.id = element.id;
            buttonDel.addEventListener('click',()=>{
                this.removeTicket(element.id);
            });

            li.classList.add('task_item');
            li.innerText = element.name;

            //Если завершена добавлять класс
            if (element.status) {
                li.classList.add('completed');
            }
            //Вставка элементов
            li.append(buttonEdit);
            li.append(buttonDel);
            listtask.append(li);
        });

        // const listtask = `
        // <ul class="task_list">
        // ${arrTask.map(element => {
        //     let listElem = '<li class="task_item'
        //     if (element.status){
        //         listElem +=' completed'
        //     }else{
        //         listElem +=''
        //     }
        //         listElem += '">';
        //         listElem += element.name;
        //         listElem += '</li>';
        //     return listElem;
        // }).join('')}
        // </ul>
        // `;
        this.areaTask.innerHTML = '';
        this.areaTask.append(buttonAddTask);
        this.areaTask.append(listtask);
    }
    renderModalTicket(ticket) {
        console.log(ticket)
        this.areaForModal.innerHTML = '';
        this.areaForModal.classList.toggle('active');

        const formNewTicket = document.createElement('form');
        formNewTicket.classList.add('form_new_ticket');

        const nameNewTicket = document.createElement('p');
        nameNewTicket.classList.add('name_new_ticket');
        nameNewTicket.innerText ='Название: '+ ticket[0].name;

        const descriptionNewTicket = document.createElement('p');
        descriptionNewTicket.classList.add('description_new_ticket');
        descriptionNewTicket.innerText = 'Описание: '+ticket[0].description;

        const dateTicket = document.createElement('p');
        dateTicket.innerText = 'Дата создания: '+ new Date(ticket[0].created).toLocaleString();

        const cancelNewTicket = document.createElement('button');
        cancelNewTicket.innerText = 'Отменить';
        cancelNewTicket.addEventListener('click', evt => {
            evt.preventDefault();
            this.areaForModal.classList.toggle('active');
        });

        formNewTicket.append(nameNewTicket);
        formNewTicket.append(descriptionNewTicket);
        formNewTicket.append(dateTicket);
        formNewTicket.append(cancelNewTicket);

        this.areaForModal.append(formNewTicket);
    }

    requestAllTicket() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:7070?method=allTickets');
        xhr.addEventListener('readystatechange', () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    this.renderTaskList(JSON.parse(xhr.response));
                }
            }
        });
        xhr.send();
    }
    requestTicket(id) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `http://localhost:7070?method=ticketById&id=${id}`);
        xhr.addEventListener('readystatechange', () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    this.renderModalTicket(JSON.parse(xhr.response));
                }
            }
        });
        xhr.send();
    }

    addTicket(name, desc) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:7070?method=createTicket');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.addEventListener('readystatechange', () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    this.requestAllTicket();
                }
            }
        });
        xhr.send(JSON.stringify({ name: name, description: desc }));

    }
    removeTicket(id){
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:7070?method=removeTicket');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.addEventListener('readystatechange', () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    this.requestAllTicket();
                }
            }
        });
        xhr.send(JSON.stringify({ id: id }));
    }

}

