class App{
  constructor(){
      this.Modal = document.querySelector('.tic');
      this.dell = document.querySelector('.del');
      this.ticket = '';
      this.getTickets();
  }


  listener(){
      document.addEventListener('click', (e)=>{
          if(e.target.classList[0] == 'add'){
              this.Modal.children[0].children[0].innerHTML = 'Добавить тикет'
              this.Modal.classList.remove('fog');
          };
          if(e.target.classList[0] == 'cross'){
              this.dell.classList.remove('fog');
              this.ticket = e.target.parentElement.parentElement;
          };        
          if(e.target.classList[0] == 'footer_btn' && this.dell.classList[this.dell.classList.length - 1] != 'fog'){
              if (e.target.value == 'Отмена'){
                  e.preventDefault();
                  this.dell.classList.add('fog');
              } else{
                  this.dell.classList.add('fog');
                  this.ticket.classList.add('fog');
              }
          };
          if(e.target.classList[0] == 'footer_btn' && this.Modal.classList[this.dell.classList.length - 1] != 'fog'){
              const parentModal = e.target.parentElement.parentElement.children[0].innerHTML;
              if (e.target.value == 'Отмена'){
                  e.preventDefault();
                  this.clearModal();
                  this.Modal.classList.add('fog');
                  return;
              };
              if(parentModal == 'Изменить тикет'){
                  e.preventDefault();
                  const formData = new FormData(this.Modal.querySelector('.form-modal'));
                  if(formData.get('name').length != 0){
                  this.ticket.children[0].children[1].innerHTML = formData.get('name');
                  this.Modal.classList.add('fog');
                  this.clearModal();
                  } else {
                      alert('input first string')
                  }
              } else {
                  e.preventDefault();
                  const formData = new FormData(this.Modal.querySelector('.form-modal'));
                  const newTicket = {
                      id:null,
                      name:formData.get('name'),
                      status:false,
                      description:formData.get('description'),
                  };
                  if(newTicket.name == ''){
                    alert('input first string')
                    return;
                  }
                  this.Modal.classList.add('fog');
                  this.pushTicket(newTicket);       
                  this.clearModal();      
              };
          };
          if (e.target.classList[0] == 'pencil'){
              this.ticket = e.target.parentElement.parentElement;
              this.Modal.children[0].children[0].innerHTML = 'Изменить тикет';
              this.Modal.classList.remove('fog');
          };
          if (e.target.classList[0] == 'done_check'){
              this.ticket = e.target.parentElement.parentElement.parentElement;
          };
          if (e.target.classList[0] == 'title'){
              this.ticket = e.target.parentElement.parentElement;
          }
          if(e.target.classList[0] == 'title'){
              if(this.ticket.children[1].classList.length==1){
                  this.ticket.children[1].classList.add('fog');
              }else{
                  this.requestDesc();
              };              
          };
      });
  };

  clearModal() {
    document.querySelector('.modal_name').value = '';
    document.querySelector('.modal_description').value='';
    };


  async requestDesc(){
    const response = await fetch(`http://127.0.0.1:9090/?method=ticketById&id=${this.ticket.id}`, {
      method: 'GET',
      mode: 'cors'
    });
    if(response.status == 200){
      let ticket = await response.json();
      this.createDesc(ticket.description);
    };
  };

  createDesc(desc){
      this.ticket.children[1].innerHTML = desc;
      this.ticket.children[1].classList.remove('fog');
  };

  async pushTicket(newTicket){
    const response = await fetch('http://localhost:9090/?method=createTicket', {
      method: 'POST',
      mode: 'cors', 
      cache: 'no-cache', 
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
        body: JSON.stringify(newTicket)
    });
    if(response.status == 200){
      this.getTickets();
    };
  };

  createTickets(list){    
    this.clearTicketArea();    
    for (let ticket of list){
      this.createOneTicket(ticket);
    };
  };

  createOneTicket(dict){
      let ticketArea = document.querySelector('.ticket_area');
      let ticket = document.createElement('div');
      let ticketTitle = document.createElement('div');
      let doneСircle = document.createElement('div');
      let title = document.createElement('div');
      let date = document.createElement('div');
      let pencil = document.createElement('div');
      let cross = document.createElement('div');
      let description = document.createElement('div');
      ticket.classList.add('ticket');
      ticket.id = dict.id;
      ticketTitle.classList.add('ticket_title');
      doneСircle.classList.add('done');
      if (dict.status){
      doneСircle.innerHTML = '<input class="done_check" type="checkbox" checked>'
      } else {
          doneСircle.innerHTML = '<input class="done_check" type="checkbox">'
      };
      doneСircle.classList.add('circle');
      title.classList.add('title');
      title.innerHTML = dict.name;
      date.classList.add('date');
      date.innerHTML = dict.created;
      pencil.classList.add('pencil');
      pencil.classList.add('circle');
      pencil.innerHTML = '&#9998'
      cross.classList.add('cross');
      cross.classList.add('circle');
      cross.innerHTML = '&#10006';
      description.classList.add('description');
      description.classList.add('fog');
      ticketArea.appendChild(ticket)
      ticket.appendChild(ticketTitle);
      ticket.appendChild (description);
      ticketTitle.appendChild (doneСircle);
      ticketTitle.appendChild(title);
      ticketTitle.appendChild(date);
      ticketTitle.appendChild(pencil);
      ticketTitle.appendChild(cross);
  };

  async getTickets(){
    const response = await fetch('http://127.0.0.1:9090/?method=allTickets', {
      method: 'GET',
      mode: 'cors'
    });
    if(response.status == 200){
      let result = await response.json();
      this.createTickets(result);
    }
  };

  clearTicketArea(){
    const list = document.querySelectorAll(".ticket");
    for (let dv of list){
      dv.remove()
    };
  };

};


const newApp = new App();
newApp.listener();
