var employeesArr = [];
var avatarUrl = "./img/avatar.png";
var request;
var minlength = 3;

$(function () {
  getAll();
  getAllDepartments();

  $(document).on("submit", "#addEmployeeForm", createPersonnel);
  $(document).on("submit", "#editEmployeeForm", updatePersonnel);

  $(document).on("click", ".delete", deletePersonnel);

  $(document).on("click", "#department-btn", getLocation);
  $(document).on("submit", "#addDepartmentForm", createDepartment);
  $(document).on("click", " #employee-btn", function () {
    $("#addEmployeeForm").trigger("reset");
  });
  $(document).on("submit", "#deleteDepartmentForm", deleteDepartment);
  
  $(document).on("click", ".update", getPersonnelById);
  $(document).on("keyup", "#searchInput", function () {
    console.log("true");
    // var that = this;
    var term = $(this).val();

    if (term.length >= minlength) {
      if (request) {
        request.abort();
      };
      request = searchQuery(term);
    } else {
      getAll();
    }
  });
  $(document).on("search", "#searchInput", function () {
    var value = $("#searchInput").val();
    if (value == "") {
      getAll();
    }
  });

  $(document).on("click", "#back-to-top", function (e) {
    e.preventDefault();
    $("html, body").animate({ scrollTop: 0 }, 0);
  });
});


function getAll() {
  $.ajax({
    url: "libs/php/getAll.php",
    dataType: "json",
    success: function (result) {
      $("#inner-cards").empty();
      let data = result.data;
      console.log(data);
      createCards(data);
    },
  });
}

function getAllDepartments() {
  $.ajax({
    url: "libs/php/getAllDepartments.php",
    dataType: "json",
    success: function (result) {
      let data = result.data;
      console.log(result);
      data.sort((a, b) => a.name.localeCompare(b.name));

      data.forEach((element) => {
        $(".department-select").append(
          `<option value="${element.id}">${element.name}</option>`
        );
      });
    },
  });
}

function createPersonnel(e) {
  e.preventDefault();
  $.ajax({
    url: "libs/php/createPersonnel.php",
    type: "POST",
    data: $("#addEmployeeForm").serialize(),
    cache: false,
    success: function (data) {
      $.alert("Personel Added");
      getAll();
      $(".department-select").find("option:gt(0)").remove();  
      getAllDepartments();
      $("#addEmployeeForm").trigger("reset");
    },
    error: function (request, status, error) {
      $.alert(request.responseText);
    },
  });
}

function createDepartment(e) {
  e.preventDefault();

  $.ajax({
    url: "libs/php/insertDepartment.php",
    type: "POST",
    data: $("#addDepartmentForm").serialize(),
    cache: false,
    success: function (data) {
      $.alert("Department added!");
      $(".department-select").find("option:gt(0)").remove();
      getAllDepartments();
      $("#addDepartmentForm").trigger("reset");
    },
    error: function (request, status, error) {
      alert(request.responseText);
    },
  });
}

function updatePersonnel(e) {
  e.preventDefault();
  $.confirm({
    title: "Please Confirm",
    content: "Are you sure you want to save this changes?",
    buttons: {
      confirm: function () {
        $.ajax({
          url: "libs/php/updatePersonnel.php",
          type: "POST",
          data:
            $("#editEmployeeForm").serialize() +
            `&id=${$("#editEmployeeForm").data("id")}`,
          cache: false,
          success: function (data) {
            console.log(data);
            getAll();
            $.alert("Details updated successfully!")
          },
          error: function(response, status, error) {
              $.alert(response.responseText);
          }
        });
      },
      cancel: function () {
        return;
      },
    },
  });
}

function deletePersonnel() {
  var element = $(this).parent();
  var id = $(this).data("id");

  $.confirm({
    title: "Please Confirm",
    content: "Are you still want to delete this record?",
    buttons: {
      confirm: function () {
        $.ajax({
          url: "libs/php/deletePersonnel.php",
          type: "POST",
          data: {
            id: id,
          },
          success: function (data) {
            console.log(data);

            if (data.status["code"] == 200) {
              element.fadeOut().remove();
            }
            $.alert("Department has been deleted!")
          },
        });
      },
      cancel: function () {
        return;
      },
    },
  });
}

function deleteDepartment(e) {
  e.preventDefault();
  $.confirm({
    title: "Please Confirm",
    conent: "Are you sure you want to delete this department?",
    buttons: {
      confirm: function () {
        var depId = $("#selectDepartmentDelete").val();
        $.ajax({
          url: "libs/php/deleteDepartmentByID.php",
          type: "POST",
          cache: false,
          data: {
            id: depId,
          },
          success: function (data) {
            // console.log(data);
            $(".department-select").find("option:gt(0)").remove();
            getAllDepartments();
            $("#deleteDepartmentForm").trigger("reset");
            $.alert("Department deleted!")
          },
          error: function(response, status, error) {
              $.alert(response.responseText);
          }
        });
      },
      cancel: function () {
        return;
      },
    },
  });
}

function getPersonnelById() {
  var id = $(this).data("id");
  $.ajax({
    url: "libs/php/getPersonnelByID.php",
    dataType: "json",
    data: {
      id: id,
    },
    success: function (data) {
      var p = data.data.personnel[0];
      getAllDepartments();
      $('input[name="firstName"]').val(p.firstName);
      $('input[name="lastName"').val(p.lastName);
      $('input[name="email"]').val(p.email);
      $('input[name="jobTitle]').val(p.jobTitle);
      $('select[name="departmentId"').val(p.departmentID);
      $("#editEmployeeForm").data("id", p.id);
    },
  });
}

function getLocation() {
  $("#selectLocationId").find("option").not(":first").remove();
  $("#addDepartmentForm").trigger("reset");
  $("#deleteDepartmentForm").trigger("reset");

  $.ajax({
    url: "libs/php/getLocations.php",
    dataType: "json",
    success: function (data) {
      console.log(data);
      var result = data.data;
      result.forEach((element) => {
        $("#selectLocationId").append(
          `<option value="${element.id}">${element.name}</option>`
        );
      });
    },
  });
}

function searchQuery(term) {
  $.ajax({
    url: "libs/php/searchTerm.php",
    data: {
      q: term,
    },
    success: function (result) {
      $("#inner-cards").empty();
      let data = result.data.personnel;
      createCards(data);
      request = null;
    },
  });
}

function createCards(array) {
  array.forEach((element) => {
    $("#inner-cards").append(
      `<div class="card " style="width: 20rem;">
            
               <div class="card-header shadow-sm mb-2 rounded">
               <img class="rounded mx-auto d-block" src="./img/avatar.png" alt="avatar" width="50"/>
               <button type="button" class="btn btn-transparent position-absolute end-0 top-0 update" data-bs-toggle="modal" data-bs-target="#editEmployeeModal" data-id="${
                 element.id
               }"><i class="bi bi-pencil-square"></i></button>
                 <h5 class="card-title text-center">${element.firstName} ${
        element.lastName
      }</h5>
                 <h6 class="text-center">${
                   element.jobTitle ? element.jobTitle : "-"
                 }</h6>
               </div>
               <div class="card-body bg-light bg-gradient shadow-sm rounded">
                    <p class="card-text">E-mail: <span class="fw-light">${
                      element.email
                    }</span></p>
                    <p class="card-text">Department: <span class="fw-light">${
                      element.department
                    }</span></p>
                    <p class="card-tex">Location: <span class="fw-light">${
                      element.location
                    }</span></p>
               </div>
               <button type="button" class="btn btn-transparent delete" data-id="${
                 element.id
               }"><i class="bi bi-trash"></i></button>
            </div>`
    );
  });
}
