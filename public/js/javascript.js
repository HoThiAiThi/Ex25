document.addEventListener("DOMContentLoaded", function () {
  const list_task = document.getElementById("list-task");
  const totalTaskElement = document.getElementById("totalTaskElement");
  const taskForm = document.getElementById("taskForm");
  const btnAddTask = document.getElementById("btnAddTask");
  const inputTaskname = document.getElementById("inputTaskname");
  const inputDescription = document.getElementById("inputDescription");
  const btnCancel = document.getElementById("btnCancel");
  const btnConfirmAddTask = document.getElementById("btnConfirmAddTask");
  const addForm = document.getElementById("addForm");
  const btnClose = document.getElementById("btnClose");
  const backdrop = document.getElementById("backdrop");
  const editableContent = document.getElementById("editableContent");
  const btnEditCancel = document.getElementById("btnEditCancel");
  const btnSave = document.getElementById("btnSave");
  const btnAddSubTask = document.getElementById("btnAddSubTask");
  const btnCancelSubTask = document.getElementById("btnCancelSubTask");
  const btnConfirmAddSubTask = document.getElementById("btnConfirmAddSubTask");
  const taskSubForm = document.getElementById("taskSubForm");
  const addSubTask = document.getElementById("addSubTask");
  const inputSubTaskname = document.getElementById("inputSubTaskName");
  const inputSubDescription = document.getElementById("inputSubDescription");
  const totalSubTask = document.getElementById("totalSubTask");
  const list_sub_task = document.getElementById("list-sub-task");
  const btnSaveSubTask = document.getElementById("btnSaveSubTask");
  const inputParentTask = document.getElementById("parentIdTask");
  const modalContainer = document.getElementById("modal-container");
  const datePickerInput = document.getElementById("date-picker-subtask");

  var arrayListTasks = [];
  var arraySubListTasks = [];

  loadFromLocalStorage();

  // Hàm để lưu dữ liệu vào localStorage 
  function saveToLocalStorage() {
    localStorage.setItem("arrayListTasks", JSON.stringify(arrayListTasks));
  }

  // Hàm để tải dữ liệu từ localStorage và cập nhật arrayListTask
  function loadFromLocalStorage() {
    const tasksFromLocalStorage = JSON.parse(
      localStorage.getItem("arrayListTasks")
    );
    if (tasksFromLocalStorage) {     
      arrayListTasks = tasksFromLocalStorage;
      renderNewTask();
    }
  }

  // hien thi va khong hien thi form Add Task
  btnAddTask.addEventListener("click", function () {
    taskForm.style.display = "block";
    addForm.style.display = "none";
  });

  btnCancel.addEventListener("click", function () {
    taskForm.style.display = "none";
    addForm.style.display = "block";
  });

  // Hàm render ra Task List
  function renderNewTask() {
    list_task.innerHTML = "";
    let arrayNewListTask = arrayListTasks.sort(
      (a, b) => b.priority - a.priority
    );
    arrayNewListTask.forEach((item) => {
      const newTaskHTML = createTaskHTML(
        item.id,
        item.name,
        item.description,
        false
      );
      list_task.innerHTML += newTaskHTML;
    });
    updateTotalTasks();

    const ellipsisIcons = document.querySelectorAll(".fa-ellipsis-vertical");
    ellipsisIcons.forEach((icon) => {
      icon.addEventListener("click", function () {
        const dropdownMenu = this.parentElement.previousElementSibling;
        dropdownMenu.classList.toggle("hidden");
      });
    });

    //xoa task
    const deleteTaskButtons = document.querySelectorAll(".delete-task");
    deleteTaskButtons.forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        const taskItem =
          this.parentElement.parentElement.parentElement.parentElement;
        const taskId = taskItem.dataset.task; 

        // Xóa task khỏi mảng arrayListTasks
        arrayListTasks = arrayListTasks.filter(
          (task) => task.id !== parseInt(taskId)
        );
        saveToLocalStorage();

        // Xóa task khỏi giao diện
        taskItem.remove();
        updateTotalTasks();
      });
    });

    const taskItem = document.querySelectorAll("#list-task .itemTask");
    taskItem.forEach((item) => {
      item.addEventListener("click", function (event) {
        const idCurrent = this.dataset.task;

        const taskNameElement = document.getElementById("modalLabel");
        const taskDescriptionElement = document.getElementById("modalDes");

        const currentItem = arrayListTasks.find((task) => task.id == idCurrent);
        if (currentItem) {
          modalContainer.dataset.task = idCurrent;
          taskNameElement.textContent = currentItem.name;
          taskDescriptionElement.textContent = currentItem.description;

          if (currentItem.subTask) {
            let sortSubTask = currentItem.subTask.map(
              (a, b) => b.priority - a.priority
            );
            list_sub_task.innerHTML = "";
            sortSubTask.forEach((item) => {
              const newTaskHTML = createTaskHTML(
                item.id,
                item.name,
                item.description,
                true
              );
              list_sub_task.innerHTML += newTaskHTML;
            });
          }
        }

        const clickedElement = event.target;
        const isCheckbox = clickedElement.classList.contains("form-checkbox");
        const isUpdateButton = clickedElement.classList.contains("update-task");

        // Kiểm tra nếu không phải là checkbox hoặc nút Update trong menu
        if (!isCheckbox && !isUpdateButton) {
          // Lấy dropdown-menu để kiểm tra nếu nó đang được hiển thị
          const dropdownMenu = this.querySelector(".dropdown-menu");
          const isDropdownMenuVisible =
            dropdownMenu && !dropdownMenu.classList.contains("hidden");

          // Kiểm tra xem dropdown-menu có đang được hiển thị hay không
          if (!isDropdownMenuVisible) {
            const modal = document.getElementById("modal-container");
            const taskParentId = this.querySelector("#valueParent").value;

            renderSubTask(taskParentId);
            modal.classList.add("show");
          }
        }
      });
    });

    //sự kiện click cho icon "Update" trong menu
    const updateTaskButtons = document.querySelectorAll(".update-task");
    updateTaskButtons.forEach((button) => {
      button.addEventListener("click", function (event) {
        const modal = document.getElementById("modal-container");
        const parentId2 = inputParentTask.value;
        renderSubTask(parentId2);
        modal.classList.add("show");

        // hidden menu dropdown sau khi click vào nút "Update"
        const dropdownMenu = this.parentElement.parentElement;
        dropdownMenu.classList.add("hidden");

        event.stopPropagation();
      });
    });
  }

  // Hàm để tạo HTML cho một task
  function createTaskHTML(id, taskName, description, addToModal = false) {
    let taskHTML = `
            <div id="item-${id}" class="itemTask flex items-start pb-2 border-b-2 w-full" data-task="${id}">
              <input type="checkbox" class="form-checkbox mt-2 rounded-full w-5 h-5">
              <div class="task-item flex-grow ms-3">
                  <input type="checkbox" id="valueParent" value="${id}" data-parent="${id}" hidden>
                  <label for="form-checkbox" class="text-[10px]">${taskName}</label>
                  <p class="text-[#8f9eb4] text-[10px] mt-1">${description}</p>
              </div>
              <div class="dropdown-menu hidden">
                  <ul>
                      <li class="border-b-2 px-2"><i class="fa-solid fa-pen fa-2xs" style="color: #a0aec0;" ></i><a href="#" class="update-task font-bold ml-2 text-[10px]">Update</a></li>
                      <li class="px-2 "><i class="fa-solid fa-trash fa-2xs" style="color: #e53e3e;"></i><a href="#" class="delete-task text-[#e53e3e] font-bold ml-2 text-[10px] ">Delete</a></li>
                  </ul>
              </div>
                <div class="flex justify-end mt-3">
                    <i class="fa-solid fa-ellipsis-vertical fa-xs" style="color: #a0aec0;"></i>
                </div>
            </div>
      `;

    if (addToModal) {
      // Thêm margin left khi thêm vào modal
      taskHTML = `<hr class="horizontal-line border-t-1"> <div style="margin-left: 20px;">${taskHTML}</div>`;
    }

    return taskHTML;
  }

  // close modal
  btnClose.addEventListener("click", function () {
    const modal = document.getElementById("modal-container");
    modal.classList.remove("show");
  });

  // close backdrop modal
  backdrop.addEventListener("click", function () {
    const modal = document.getElementById("modal-container");
    modal.classList.remove("show");
  });

  // kiem tra trang thai checked cua checkbox
  list_task.addEventListener("click", function (event) {
    if (event.target.type === "checkbox") {
      updateTotalTasks(list_task, totalTaskElement);

      const label = event.target.nextElementSibling.querySelector("label");
      const description = event.target.nextElementSibling.querySelector("p");

      if (event.target.checked) {
        label.style.textDecoration = "line-through";
        description.style.textDecoration = "line-through";
      } else {
        label.style.textDecoration = "none";
        description.style.textDecoration = "none";
      }
    }
  });

  // kiểm tra trạng thái checkbox trong modal
  const modalLabel = document.querySelector(
    "#modal-container .main-modal label"
  );
  const modalDescription = document.querySelector(
    "#modal-container .main-modal p"
  );
  const modalCheckbox = document.querySelector(
    "#modal-container .main-modal input[type='checkbox']"
  );

  // Kiểm tra sự kiện click của checkbox trong modal
  modalCheckbox.addEventListener("click", function (event) {
    if (event.target.type === "checkbox") {
      const isChecked = event.target.checked;

      // Cập nhật trạng thái của checkbox trong modal
      modalLabel.style.textDecoration = isChecked ? "line-through" : "none";
      modalDescription.style.textDecoration = isChecked
        ? "line-through"
        : "none";
    }
  });

  //update total Task
  function updateTotalTasks() {
    let checkedTasks = list_task.querySelectorAll(
      'input[type="checkbox"]:checked'
    ).length;
    let totalTasks = list_task.children.length;
    let remainingTasks = totalTasks - checkedTasks;
    totalTaskElement.innerHTML = `${remainingTasks}/${totalTasks} tasks <i class="fa-solid fa-check me-2"></i> `;
  }

  // confirm addTask
  btnConfirmAddTask.addEventListener("click", function () {
    const taskName = inputTaskname.value;
    const description = inputDescription.value;
    const dueDate = dueDateInput.value;
    const priority = selectedPriority; // Lấy giá trị priority đã chọn

    if (taskName.trim() !== "" && description.trim() !== "") {
      var taskItem = {
        id: Math.ceil(Math.random() * 900 + 100),
        name: taskName,
        description: description,
        dueDate: dueDate,
        priority: priority,
        subTask: [],
      };
      arrayListTasks.push(taskItem);

      renderNewTask();

      inputTaskname.value = "";
      inputDescription.value = "";
      // Reset dropdown priority về trạng thái ban đầu
      priorityText.textContent = "Priority";
      priorityIcon.className = "fa-regular fa-flag fa-sm";
      priorityIcon.style.color = "";
      resetDatepicker("date-picker");
      saveToLocalStorage();
    }
    taskForm.style.display = "none";
    addForm.style.display = "block";
  });

  // MODAL
  // // Lấy nội dung ban đầu của label và description
  let originalContent = {
    label: "",
    description: "",
  };

  // Hiển thị hoặc ẩn nút Cancel và Save
  const toggleButtons = (isVisible) => {
    const editableContent = document.getElementById("editableContent");
    if (isVisible) {
      editableContent.classList.add("editing");
      btnEditCancel.style.display = "inline-block";
      btnSave.style.display = "inline-block";
    } else {
      editableContent.classList.remove("editing");
      btnEditCancel.style.display = "none";
      btnSave.style.display = "none";
    }
  };

  //Sự kiện click vào task main để chỉnh sửa nội dung
  editableContent.addEventListener("click", function () {
    // Lấy id của task đang chỉnh sửa
    const taskId = modalContainer.dataset.task;

    // Lấy thông tin của task từ mảng arrayListTasks
    const currentItem = arrayListTasks.find((task) => task.id == taskId);
    
    if (currentItem) {
      // Lưu nội dung ban đầu của task
      originalContent.label = currentItem.name;
      originalContent.description = currentItem.description;

      // Hiển thị form sửa và điền thông tin của task vào form
      inputTaskname.value = originalContent.label;
      inputDescription.value = originalContent.description;
    }
    toggleButtons(true);
  });

  // Sự kiện click vào nút Cancel
  btnEditCancel.addEventListener("click", function () {
    document.getElementById("modalLabel").textContent = originalContent.label;
    document.getElementById("modalDes").textContent =
      originalContent.description;
    toggleButtons(false);
  });

  // Sự kiện click vào nút "Save"
  btnSave.addEventListener("click", function () {
    // Lấy id của task đang chỉnh sửa
    const taskId = modalContainer.dataset.task;   

    // Lấy nội dung mới của task từ form
    const newTaskName = modalLabel.innerText;
    const newDescription = modalDescription.innerText;

    // Cập nhật nội dung của task trên giao diện
    document.querySelector(".task-item label").textContent = newTaskName;
    document.querySelector(".task-item p").textContent = newDescription;

    // Tìm task tương ứng trong mảng arrayListTasks và cập nhật nội dung mới
    const taskToUpdate = arrayListTasks.find((task) => task.id.toString() === taskId.toString());   

    if (taskToUpdate) {
        taskToUpdate.name = newTaskName;
        taskToUpdate.description = newDescription;
    }

    // Lưu thay đổi vào localStorage
    saveToLocalStorage();

    // Ẩn các nút Cancel và Save sau khi đã lưu
    toggleButtons(false);
  });


  // hiển thị và ẩn form add sub task
  btnAddSubTask.addEventListener("click", function () {
    taskSubForm.style.display = "block";
    addSubTask.style.display = "none";
  });

  btnCancelSubTask.addEventListener("click", function () {
    taskSubForm.style.display = "none";
    addSubTask.style.display = "block";
    inputSubTaskname.value = "";
    inputSubDescription.value = "";
  });
  // render ra task list khi click btn confirmSubTask
  btnConfirmAddSubTask.addEventListener("click", function () {
    const subTaskName = inputSubTaskname.value;
    const subDescription = inputSubDescription.value;
    const parentId = modalContainer.dataset.task;
    const subDuedate = datePickerInput.value;
    console.log(subDuedate)
    const subPriority = selectedSubtaskPriority;
    console.log(subPriority)

    if (subTaskName.trim() !== "" && subDescription.trim() !== "") {
      var itemSubTab = {
        parentId: parentId,
        name: subTaskName,
        description: subDescription,
        duedate: subDuedate,
        priority: subPriority,
      };

      // Tìm công việc cha trong mảng arrayListTasks có id là parentId
      const findParentTaskIndex = arrayListTasks.findIndex(
        (item) => item.id == parentId
      );

      // Kiểm tra xem công việc cha có tồn tại không
      if (findParentTaskIndex !== -1) {
        // Nếu tồn tại, thêm itemSubTab vào mảng subTask của công việc cha
        arrayListTasks[findParentTaskIndex].subTask.push(itemSubTab);
        arraySubListTasks.push(itemSubTab);
      } else {
        console.log("Không tìm thấy công việc cha có id là " + parentId);
      }

      renderSubTask(parentId);
      inputSubTaskname.value = "";
      inputSubDescription.value = "";
      // Reset dropdown priority về trạng thái ban đầu
      subTaskPriorityText.textContent = "Priority";
      subTaskPriorityIcon.className = "fa-regular fa-flag fa-sm";
      subTaskPriorityIcon.style.color = "";
      resetDatepicker("date-picker-subtask");
    }
    taskSubForm.style.display = "none";
    addSubTask.style.display = "block";
    totalSubTask.style.display = "block";
    addSubTask.style.marginLeft = "20px";
    saveToLocalStorage();
  });

  //ham renderSubTask
  function renderSubTask(parentId) {
    list_sub_task.innerHTML = "";
    const filterItems = arrayListTasks.find((item) => item.id == parentId);
    if (filterItems && filterItems.subTask) {
      filterItems.subTask.forEach((itemTask) => {
        const newTaskHTML = createTaskHTML(
          itemTask.parentId,
          itemTask.name,
          itemTask.description,
          true
        );
        list_sub_task.innerHTML += newTaskHTML;
      });
    }
    updateTotalSubTasks();

    const ellipsisIcons = document.querySelectorAll(".fa-ellipsis-vertical");

    ellipsisIcons.forEach((icon) => {
      icon.addEventListener("click", function () {
        const dropdownMenu = this.parentElement.previousElementSibling;
        dropdownMenu.classList.toggle("hidden");
      });
    });

    //update sub task
    const updateButtons = document.querySelectorAll(
      ".list_sub_tab .update-task"
    );

    updateButtons.forEach((button) => {
      button.addEventListener("click", function (event) {
        event.stopPropagation();
        const taskItem = this.closest(".flex").querySelector(".task-item");
        if (taskItem) {
          // Ẩn subtask list
          const subtaskListContainer = this.closest(".list_sub_tab");
          subtaskListContainer.style.display = "none";

          // Ẩn tất cả các dropdown menu
          const allDropdownMenus = document.querySelectorAll(".dropdown-menu");
          allDropdownMenus.forEach((menu) => {
            menu.classList.add("hidden");
          });

          const label = taskItem.querySelector("label");
          const description = taskItem.querySelector("p");

          if (label && description) {
            // Lấy nội dung của task và hiển thị trong subtaskform
            inputSubTaskname.value = label.textContent;
            inputSubDescription.value = description.textContent;

            // Hiển thị subtaskform và ẩn task-item
            taskSubForm.style.display = "block";
            addSubTask.style.display = "none";
            btnConfirmAddSubTask.style.display = "none";
            btnSaveSubTask.style.display = "block";
          }

          // Xử lý sự kiện click vào nút "Save" trong subtask form
          btnSaveSubTask.addEventListener("click", function () {
            const subTaskLabel = taskItem.querySelector("label");
            const subTaskDescription = taskItem.querySelector("p");
            const subTaskDuedate = datePickerInput.value;
            const subTaskPriority = selectedSubtaskPriority;
            // console.log(subTaskDuedate)
            // console.log(subTaskPriority)
            // Cập nhật nội dung của subtask trên giao diện
            subTaskLabel.textContent = inputSubTaskname.value;
            subTaskDescription.textContent = inputSubDescription.value;

            // Tìm subtask tương ứng trong mảng arraySubListTasks và cập nhật nội dung
            const parentId = taskItem.querySelector("#valueParent").value;
            // console.log(parentId)
            const subTaskName = subTaskLabel.textContent;
            // console.log(subTaskName)
            // console.log(arrayListTasks)
            // console.log(arraySubListTasks)
            const subTaskToUpdate = arraySubListTasks.find(
              (item) => item.parentId === parentId && item.name === subTaskName
            );     
            // console.log(subTaskToUpdate)     
            if (subTaskToUpdate) {
              subTaskToUpdate.name = inputSubTaskname.value;
              subTaskToUpdate.description = inputSubDescription.value;
              subTaskToUpdate.duedate = subTaskDuedate; 
              subTaskToUpdate.priority = subTaskPriority; 
            }

            const parentTask = arrayListTasks.find(
              (task) => task.id === parentId
            );
            if (parentTask) {
              const subTask = parentTask.subTask.find(
                (task) => task.name === subTaskName
              );
              if (subTask) {
                subTask.name = inputSubTaskname.value;
                subTask.description = inputSubDescription.value;
                subTask.duedate = subDuedate.value; 
                subTask.priority = subPriority.value; 
              }
            }

            // Hiển thị lại giao diện
            taskSubForm.style.display = "none";
            addSubTask.style.display = "block";
            btnConfirmAddSubTask.style.display = "inline-block";
            btnSaveSubTask.style.display = "none";
            subtaskListContainer.style.display = "block";
            inputSubTaskname.value = "";
            inputSubDescription.value = "";
           
            saveToLocalStorage();
          });

          // Xử lý sự kiện click vào nút "Cancel" trong subtask form
          btnCancelSubTask.addEventListener("click", function () {
            taskSubForm.style.display = "none";
            addSubTask.style.display = "block";
            btnConfirmAddSubTask.style.display = "inline-block";
            btnSaveSubTask.style.display = "none";
            subtaskListContainer.style.display = "block";
            inputSubTaskname.value = "";
            inputSubDescription.value = "";
            saveToLocalStorage();
          });
        }
      });
    });

    //xoa sub task
    const deleteTaskButtons = document.querySelectorAll(".delete-task");
      deleteTaskButtons.forEach(function (button) {
        button.addEventListener("click", function (event) {
          event.preventDefault();
          const taskItem =
            this.parentElement.parentElement.parentElement.parentElement;
          const parentId = taskItem.querySelector("#valueParent").value;
          // console.log(parentId)
          const subTaskName = taskItem.querySelector("label").textContent;
          // console.log(subTaskName)
          // console.log(arrayListTasks)

          // console.log(arraySubListTasks)
          // Xóa subtask khỏi mảng arraySubListTasks
          arraySubListTasks = arraySubListTasks.filter(function (item) {
            return !(item.parentId == parentId && item.name == subTaskName);
          });          

          saveToLocalStorage();

        // Xóa subtask khỏi mảng arrayListTasks
        const parentTask = arrayListTasks.find((task) => task.id == parentId);
        if (parentTask) {
          parentTask.subTask = parentTask.subTask.filter(
            (task) => task.name !== subTaskName
          );
          saveToLocalStorage();
        }

        // Xóa subtask khỏi giao diện
        taskItem.remove();
        updateTotalSubTasks();
        totalSubTask.style.display = "block";
      });
    });
  }
  // kiem tra trang thai checked sub task modal
  list_sub_task.addEventListener("click", function (event) {
    const clickedElement = event.target;
    const isCheckbox = clickedElement.type === "checkbox";

    if (event.currentTarget === list_sub_task) {
      if (isCheckbox) {
        updateTotalSubTasks();
        const label = clickedElement.nextElementSibling.querySelector("label");
        const description =
          clickedElement.nextElementSibling.querySelector("p");

        if (clickedElement.checked) {
          label.style.textDecoration = "line-through";
          description.style.textDecoration = "line-through";
        } else {
          label.style.textDecoration = "none";
          description.style.textDecoration = "none";
        }
      }
    }
  });
  // totalSubTask
  function updateTotalSubTasks() {
    let checkedTasks = list_sub_task.querySelectorAll(
      'input[type="checkbox"]:checked'
    ).length;
    let totalTasks = list_sub_task.querySelectorAll(".task-item").length;
    let remainingTasks = totalTasks - checkedTasks;
    totalSubTask.innerHTML = ` <i class="fa-solid fa-check me-2"></i> Subtask ${remainingTasks}/${totalTasks} `;
  }

  //Priority Main Task
  const priorityDiv = document.getElementById("priorityDiv");
  const priorityDropdown = document.getElementById("priorityDropdown");
  const priorityText = document.querySelector("#priorityDiv .text");
  const priorityIcon = document.querySelector(
    "#priorityDiv .fa-regular.fa-flag"
  );
  let selectedPriority = null;

  priorityDiv.addEventListener("click", togglePriorityDropdown);

  function togglePriorityDropdown() {
    const isOpen = !priorityDropdown.classList.contains("hidden");
    if (isOpen) {
      priorityDropdown.classList.add("hidden"); // Ẩn dropdown nếu đang hiển thị
    } else {
      priorityDropdown.classList.remove("hidden"); // Hiển thị dropdown nếu đang ẩn
    }
  }

  const priorityOptions = priorityDropdown.querySelectorAll(".priorityOption");
  priorityOptions.forEach(function (option) {
    option.addEventListener("click", function () {
      const priority = parseInt(option.dataset.priority);
      selectPriority(priority);
      togglePriorityDropdown(); // Ẩn dropdown sau khi chọn
    });
  });

  function selectPriority(priority) {
    if (selectedPriority === priority) {
      // Nếu đã chọn priority đang được chọn, thì reset lại
      resetPriorityDiv();
      selectedPriority = null;
    } else {
      selectedPriority = priority;
      switch (priority) {
        case 1:
          priorityText.textContent = "Priority 1";
          priorityIcon.className = "fa-solid fa-flag fa-sm";
          priorityIcon.style.color = "#ef4444";
          break;
        case 2:
          priorityText.textContent = "Priority 2";
          priorityIcon.className = "fa-solid fa-flag fa-sm";
          priorityIcon.style.color = "#f97316";
          break;
        case 3:
          priorityText.textContent = "Priority 3";
          priorityIcon.className = "fa-solid fa-flag fa-sm";
          priorityIcon.style.color = "#3b82f6";
          break;
        case 4:
          priorityText.textContent = "Priority 4";
          priorityIcon.className = "fa-solid fa-flag fa-sm";
          priorityIcon.style.color = "#14b8a6";
          break;
        default:
          break;
      }
      highlightSelectedPriority(priority); // Hiển thị dấu tích cho priority mới
      togglePriorityDropdown();
    }
  }
  function resetPriorityDiv() {
    priorityText.textContent = "Priority";
    priorityIcon.style.color = "";

    // Ẩn tất cả các dấu tích trong dropdown
    const allPriorityIcons = priorityDropdown.querySelectorAll(
      ".priorityOption i.fa-solid.fa-check"
    );
    allPriorityIcons.forEach(function (icon) {
      icon.classList.add("hidden");
    });
  }

  function highlightSelectedPriority(priority) {
    // Ẩn tất cả các dấu tích trong dropdown trước khi hiển thị dấu tích cho priority mới
    const allPriorityIcons = priorityDropdown.querySelectorAll(
      ".priorityOption i.fa-solid.fa-check"
    );
    allPriorityIcons.forEach(function (icon) {
      icon.classList.add("hidden");
    });

    // Hiển thị dấu tích cho priority mới được chọn trong dropdown
    const selectedIcon = priorityDropdown.querySelector(
      `.priorityOption[data-priority="${priority}"] .fa-solid.fa-check`
    );
    if (selectedIcon) {
      selectedIcon.classList.remove("hidden");
    }
  }

  //Datepicker Modal
  const dueDateInput = document.getElementById("date-picker");
  

  function resetDatepicker(datePickerId) {
    const datePickerInput = document.getElementById(datePickerId);
    datePickerInput.value = "Due date";
    datePickerInput.style.color = "#a0aec0"; // Màu sắc mặc định
  }
  //Hover datepicker
  const inputElement = document.getElementById("date-picker-subtask2");
  inputElement.addEventListener("click", function (event) {
    event.stopPropagation();
  });

  const datePickerContainer = document.getElementById("datePickerContainer");
  const clearDateBtn = document.getElementById("clearDateBtn");
  const datePickerInput2 = document.getElementById("date-picker-subtask2");

  datePickerContainer.addEventListener("mouseover", function () {
    if (datePickerInput.value !== "") {
      datePickerContainer.classList.add("bg-gray-200");
      clearDateBtn.classList.remove("hidden");
    }
  });

  datePickerContainer.addEventListener("mouseout", function () {
    if (datePickerInput.value !== "") {
      datePickerContainer.classList.remove("bg-gray-200");
      clearDateBtn.classList.add("hidden");
    }
  });

  //Hover Priority
  const subTaskPriorityDiv2 = document.getElementById("subTaskPriorityDiv2");
  const subTaskPriorityDropdown2 = document.getElementById(
    "subTaskPriorityDropdown2"
  );

  const chervondown = document.getElementById("chervondown");

  subTaskPriorityDiv2.addEventListener("mouseover", function () {
    const selectedPriority = selectedSubtaskPriority2;
    if (selectedPriority !== null) {
      subTaskPriorityDiv2.classList.add("bg-gray-200");
      chervondown.classList.remove("hidden");
    }
  });

  subTaskPriorityDiv2.addEventListener("mouseout", function () {
    const selectedPriority = selectedSubtaskPriority2;
    if (selectedPriority !== null) {
      subTaskPriorityDiv2.classList.remove("bg-gray-200");
      chervondown.classList.add("hidden");
    }
  });

  // Priority SubTask Modal
  const subTaskPriorityDiv = document.getElementById("subTaskPriorityDiv");
  const subTaskPriorityDropdown = document.getElementById(
    "subTaskPriorityDropdown"
  );
  const subTaskPriorityText = document.querySelector(
    "#subTaskPriorityDiv .text"
  );
  const subTaskPriorityIcon = document.querySelector(
    "#subTaskPriorityDiv .fa-regular.fa-flag"
  );
  let selectedSubtaskPriority = null;

  subTaskPriorityDiv.addEventListener("click", toggleSubtaskPriorityDropdown);

  function toggleSubtaskPriorityDropdown() {
    const isOpen = !subTaskPriorityDropdown.classList.contains("hidden");
    if (isOpen) {
      subTaskPriorityDropdown.classList.add("hidden");
    } else {
      subTaskPriorityDropdown.classList.remove("hidden");
    }
  }

  const subTaskPriorityOptions =
    subTaskPriorityDropdown.querySelectorAll(".priorityOption");
  subTaskPriorityOptions.forEach(function (option) {
    option.addEventListener("click", function () {
      const priority = parseInt(option.dataset.priority);
      selectSubtaskPriority(priority);
      toggleSubtaskPriorityDropdown();
    });
  });

  function selectSubtaskPriority(priority) {
    selectedSubtaskPriority = priority;
    switch (priority) {
      case 1:
        subTaskPriorityText.textContent = "Priority 1";
        subTaskPriorityIcon.className = "fa-solid fa-flag fa-sm";
        subTaskPriorityIcon.style.color = "#ef4444";
        break;
      case 2:
        subTaskPriorityText.textContent = "Priority 2";
        subTaskPriorityIcon.className = "fa-solid fa-flag fa-sm";
        subTaskPriorityIcon.style.color = "#f97316";
        break;
      case 3:
        subTaskPriorityText.textContent = "Priority 3";
        subTaskPriorityIcon.className = "fa-solid fa-flag fa-sm";
        subTaskPriorityIcon.style.color = "#3b82f6";
        break;
      case 4:
        subTaskPriorityText.textContent = "Priority 4";
        subTaskPriorityIcon.className = "fa-solid fa-flag fa-sm";
        subTaskPriorityIcon.style.color = "#14b8a6";
        break;
      default:
        break;
    }
    toggleSubtaskPriorityDropdown();
    
  }

  // Priority SubTask Modal
  const priorityElement = document.getElementById("subTaskPriorityDiv2");

  priorityElement.addEventListener("click", function (event) {
    event.stopPropagation();
  });

  const subTaskPriorityText2 = document.querySelector(
    "#subTaskPriorityDiv2 .text"
  );
  const subTaskPriorityIcon2 = document.querySelector(
    "#subTaskPriorityDiv2 .fa-regular.fa-flag"
  );
  let selectedSubtaskPriority2 = null;

  subTaskPriorityDiv2.addEventListener("click", toggleSubtaskPriorityDropdown2);

  function toggleSubtaskPriorityDropdown2() {
    const isOpen = !subTaskPriorityDropdown2.classList.contains("hidden");
    if (isOpen) {
      subTaskPriorityDropdown2.classList.add("hidden");
    } else {
      subTaskPriorityDropdown2.classList.remove("hidden");
    }
  }

  const subTaskPriorityOptions2 =
    subTaskPriorityDropdown2.querySelectorAll(".priorityOption");
  subTaskPriorityOptions2.forEach(function (option) {
    option.addEventListener("click", function () {
      const priority = parseInt(option.dataset.priority);
      selectSubtaskPriority2(priority);
      toggleSubtaskPriorityDropdown2();
    });
  });

  function selectSubtaskPriority2(priority) {
    selectedSubtaskPriority2 = priority;
    switch (priority) {
      case 1:
        subTaskPriorityText2.textContent = "P1";
        break;
      case 2:
        subTaskPriorityText2.textContent = "P2";
        break;
      case 3:
        subTaskPriorityText2.textContent = "P3";
        break;
      case 4:
        subTaskPriorityText2.textContent = "P4";
        break;
      default:
        break;
    }
    toggleSubtaskPriorityDropdown2();
  }
  loadFromLocalStorage();
});
