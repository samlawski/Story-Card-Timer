function Task(title){
  // Set unique ID
  this.id = Math.random().toString(36).slice(2);

  // Set variables
  var seconds = 0,
      minutes = 0,
      hours = 0,
      counter,
      display_time = "";

  // Display and Template
  function returnTwoDigits(n){
    return ('00' + n).slice(-2);
  };
  function updateTemplate(task_object, time){
    var template = `
      <div class='task' id='${task_object.id}'>
        <div>
          <input type="checkbox" onclick="toggleTaskDone(this, '${task_object.id}')"></input>
          <span class='title'>${task_object.title}</span>
        </div>
        <div>
          <span class='time'>${time}</span>
          <button class="start" onclick="startTask('${task_object.id}')">&#9658</button>
          <button class="stop hidden" onclick="stopTask('${task_object.id}')">&#10074;&#10074;</button>
          <button class="delete" onclick="removeTask('${task_object.id}')">X</button>
        </div>
      </div>
    `;
    task_object.template = template;
  };

  // Timer
  function start(){
    var task_object = this;
    counter = window.setInterval(function(){
      seconds += 1;

      if(seconds == 60){
        seconds = 0;
        minutes += 1;
      };
      if(minutes == 60){
        minutes = 0;
        hours += 1;
      };
      if(hours == 99){
        window.clearInterval(counter);
        console.log("Sorry. You should really stop working now.");
      }

      // Set Display Time
      task_object.display_time = returnTwoDigits(hours) + ":" + returnTwoDigits(minutes) + ":" + returnTwoDigits(seconds);

      // Update view template
      updateTemplate(task_object, task_object.display_time);
      document.getElementById(task_object.id).querySelector(".time").innerHTML = task_object.display_time;

    }, 1000);
  };
  function pause(){
    window.clearInterval(counter);
  };

  // Public Properties
  this.title = title;
  this.display_time = "00:00:00";
  updateTemplate(this, this.display_time);

  // Public Methods
  this.start = start;
  this.pause = pause;
}; // Task object

// select specific Task
function $Task(task_id){
  return tasks.find(function(e){ return e.id == task_id });
};
function $TaskElement(task_id){
  return document.getElementById(task_id);
}

// Add tasks
var tasks = [];

function addTask(title){
  // Add task as object to array
  var new_task = new Task(title);
  tasks.push(new_task);
  // Add template to view
  var parent = document.getElementById('tasks');
  var hidden_node = document.createElement('div');
  hidden_node.innerHTML = new_task.template;
  var taskNode = hidden_node.childNodes[1];
  parent.insertBefore(taskNode, parent.firstChild);
};

// Remove Tasks
function removeTask(task_id){
  // Stop task
  stopTask(task_id);
  // Remove task from list
  var delete_index = tasks.indexOf($Task(task_id));
  tasks.splice(delete_index, 1);
  // Remove task from views
  $TaskElement(task_id).remove();
};

// DOM Events
function sendOnEnter(event, object){
  if(event.key == "Enter"){
    // Create new Task
    addTask(object.value);
    // Reset input
    object.value = "";
  }
};
function startTask(task_id){
  $Task(task_id).start();
  // Change story card color
  $TaskElement(task_id).classList.add("active");
  toggleButton(task_id);
};
function stopTask(task_id){
  $Task(task_id).pause();
  // Change story card color
  $TaskElement(task_id).classList.remove("active");
  toggleButton(task_id);
};
function toggleTaskDone(checkbox, task_id){
  if(checkbox.checked){
    $Task(task_id).pause();
    $TaskElement(task_id).classList.add("done");
  }else {
    $TaskElement(task_id).classList.remove("done");
  }
}


// Helper
function toggleButton(task_id){
  $TaskElement(task_id).querySelector(".start").classList.toggle("hidden");
  $TaskElement(task_id).querySelector(".stop").classList.toggle("hidden");
}
