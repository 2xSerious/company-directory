var employeesArr = [];
var avatarUrl = "./img/avatar.png";
var request;
var minlength = 3;
var departmentArray = [];
var buttonPressed;
var loading = false;

$(function () {
  getAll();
  getAllDepartments();

  // PERSONNEL FORM HANDLERS
  $(document).on("submit", "#addEmployeeForm", createPersonnel);
  $(document).on("submit", "#editEmployeeForm", updatePersonnel);

  $(document).on("click", ".delete", deletePersonnel);

  // Department Modal CRUD
  $(document).on("click", "#department-btn", departmentList);
  $(document).on("click", ".editD", function () {
    var t = $(this);
    var dataId = t.data("id");
    t.parent().toggleClass("d-none");
    $(`.saveD[data-id="${dataId}"]`).parent().toggleClass("d-none");
    $(`.name-department[data-id="${dataId}"]`).removeAttr("disabled");
    $(`select[data-id="${dataId}"]`).removeAttr("disabled");
  });
  $(document).on("click", ".cancelD", function () {
    var t = $(this);
    var dataId = t.data("id");
    t.parent().toggleClass("d-none");
    $(`.editD[data-id="${dataId}"]`).parent().toggleClass("d-none");
    $(`.name-department[data-id="${dataId}"]`).attr("disabled", "disabled");
    $(`select[data-id="${dataId}"]`).attr("disabled", "disabled");
  });

  // FORM SUBMIT CONTROL
  $(document).on("click", ".submit-btn", function () {
    buttonPressed = $(this).attr("name");
    console.log(buttonPressed);
  });
  // FORM SUBMIT DEPARTMENT
  $(document).on("click", ".deleteD", function (e) {
    e.preventDefault();
    var t = $(this);
    var dataId = t.data("id");
    if (buttonPressed === "deleteD") {
      $.confirm({
        title: "Delete Department",
        content: "Delete this department?",
        buttons: {
          confirm: function () {
            deleteDepartment(dataId);
          },
          cancel: function () {
            return;
          },
        },
      });
    }
  });
  $(document).on("submit", ".form-save", function (e) {
    e.preventDefault();
    var t = $(this);
    var dataId = t.data("id");
    if (buttonPressed === "saveD") {
      updateDepartment(dataId);
    }
  });

  $(document).on("submit", "#addNewDepartment", function (e) {
    e.preventDefault();
    createDepartment();
    departmentList();
  });

  // FORM SUBMIT LOCATION
  $(document).on("submit", ".form-loc", function (e) {
    e.preventDefault();
    var t = $(this);
    var dataId = t.data("id");

    if (buttonPressed === "saveL") {
      $.confirm({
        title: "Edit Location",
        content: "Save changes?",
        buttons: {
          confirm: function () {
            updateLocation(dataId);
          },
          cancel: function () {
            return;
          },
        },
      });
    }
  });
  $(document).on("click", ".deleteL", function (e) {
    e.preventDefault();
    var t = $(this);
    var dataId = t.data("id");
    if (buttonPressed === "deleteL") {
      $.confirm({
        title: "Delete Location",
        content: "Delete this location?",
        buttons: {
          confirm: function () {
            deleteLocation(dataId);
          },
          cancel: function () {
            return;
          },
        },
      });
    }
  });
  $(document).on("submit", "#addNewLocation", function (e) {
    e.preventDefault();
    createLocation();
  });

  $(document).on("click", " #employee-btn", function () {
    $("#addEmployeeForm").trigger("reset");
    getAllDepartments();
  });

  $(document).on("click", ".update", getPersonnelById);
  $(document).on("keyup", "#searchInput", function () {
    // var that = this;
    var term = $(this).val();

    if (term.length >= minlength) {
      if (request) {
        request.abort();
      }
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

  // LOCATION HANDLERS
  $(document).on("click", "#location-btn", function () {
    locationList();
  });
  $(document).on("click", ".editL", function () {
    var t = $(this);
    var dataId = t.data("id");
    t.parent().toggleClass("d-none");
    $(`.saveL[data-id="${dataId}"]`).parent().toggleClass("d-none");
    $(`.name-location[data-id="${dataId}"]`).removeAttr("disabled");
  });
  $(document).on("click", ".cancelL", function () {
    var t = $(this);
    var dataId = t.data("id");
    t.parent().toggleClass("d-none");
    $(`.editL[data-id="${dataId}"]`).parent().toggleClass("d-none");
    $(`.name-location[data-id="${dataId}"]`).attr("disabled", "disabled");
  });

  //PRELOADER
  $("#preloader").removeClass("d-flex").addClass("d-none");
});

function getAll() {
  $.ajax({
    url: "libs/php/getAll.php",
    dataType: "json",
    success: function (result) {
      $("#inner-cards").empty();
      let data = result.data;
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
      data.sort((a, b) => a.name.localeCompare(b.name));
      $(".department-select").find("option:gt(0)").remove();
      data.forEach((element) => {
        $(".department-select").append(
          `<option value="${element.id}">${element.name}</option>`
        );
      });
    },
  });
}
function departmentList() {
  $("#departmentsList").empty();
  $.ajax({
    url: "libs/php/getAllDepartments.php",
    dataType: "json",
    success: function (result) {
      let data = result.data;
      data.sort((a, b) => a.name.localeCompare(b.name));
      data.forEach((element) => {
        $("#departmentsList").append(`
                  <form class="row g-2 p-1 form-save"  data-id="${element.id}">
                      <div class="col ">
                          
                              <input name="d-name" type="text" class="form-control name-department" placeholder="Department" aria-label="Department" data-id="${element.id}" value="${element.name}" disabled required>
                          
                      </div>
                      <div class="col ">
                          <select name="locationId" data-id="${element.id}" class="form-select locationId"   aria-label="Location" disabled required>
                            
                          </select>
                      </div>
                      <!-- <button type="submit" class=" col btn btn-success" form="addDepartmentForm">
                        Add
                      </button> -->
                      
                      <div class="col-sm pb-2 pb-sm-0 btn-group btn-group-sm" role="group" aria-label="Basic outlined example">
                        <button type="button" class="btn btn-outline-secondary btn-sm editD" data-id="${element.id}">Edit</button>
                        <button type="submit" name="deleteD" class="btn btn-outline-danger btn-sm deleteD submit-btn" data-id="${element.id}">Delete</button>
                        
                      </div>
                      <div class="d-none col-sm pb-2 pb-sm-0 btn-group btn-group-sm" role="group" aria-label="Basic outlined example">
                        <button type="submit" name="saveD" class="btn btn-success btn-sm saveD submit-btn" data-id="${element.id}">Save</button>
                        <button type="button" class="btn btn-outline-secondary btn-sm cancelD" data-id="${element.id}">Cancel</button>
                      </div>
                      <hr class="d-sm-none">
                </form>
      `);
      });
      getLocation();
      departmentArray = [];
      data.forEach((e) => {
        departmentArray.push(e);
      });
    },
  });
}

function deleteDepartment(id) {
  $.ajax({
    url: "libs/php/deleteDepartmentByID.php",
    type: "POST",
    cache: false,
    data: {
      id: id,
    },
    success: function (result) {
      var data = result.status;
      if (data.code === "400") {
        $.alert(data.description);
        return;
      }

      $(`.form-save[data-id="${id}"]`).remove();
      $(".department-select").find("option:gt(0)").remove();
      $.alert("Deleted!");
      getAllDepartments();
    },
    error: function (response, status, error) {
      $.alert(response.responseText);
    },
  });
}

function updateDepartment(id) {
  $.confirm({
    title: "Edit Department",
    content: "Save changes?",
    buttons: {
      confirm: function () {
        $.ajax({
          url: "libs/php/updateDepartment.php",
          type: "POST",
          cache: false,
          data:
            $(`form[data-id="${id}"]`).serialize() +
            `&id=${$(`form[data-id="${id}"]`).data("id")}`,
          success: function (result) {
            departmentList();
          },
          error: function (req, status, error) {
            console.log(req);
          },
        });
      },
      cancel: function () {
        return;
      },
    },
  });
}

function getLocation() {
  $(".locationId").find("option").not(":first").remove();
  // $('.locationId').empty();
  $.ajax({
    url: "libs/php/getLocations.php",
    dataType: "json",
    success: function (data) {
      var result = data.data;
      result.forEach((element) => {
        $(".locationId").append(
          `<option value="${element.id}">${element.name}</option>`
        );
      });
    },
    complete: setLocaitons,
  });
}

function setLocaitons() {
  for (var e of departmentArray) {
    $(`select[data-id="${e.id}"]`).val(e.locationID);
  }
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

function createDepartment() {
  $.ajax({
    url: "libs/php/insertDepartment.php",
    type: "POST",
    data: $("#addNewDepartment").serialize(),
    cache: false,
    success: function (result) {
      var data = result.status;
      if (data.code === "400") {
        $.alert(data.description);
        return;
      }
      $.alert("Department added.");
      $("#addNewDepartment").trigger("reset");
      getAllDepartments();
    },
    error: function (request, status, error) {
      alert(request.responseText);
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
      $('input[name="firstName"]').val(p.firstName);
      $('input[name="lastName"').val(p.lastName);
      $('input[name="email"]').val(p.email);
      $('input[name="jobTitle]').val(p.jobTitle);
      $("#selectDepartmentEdit").val(p.departmentID);
      $("#editEmployeeForm").data("id", p.id);
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
            getAll();
            $.alert("Details updated successfully!");
          },
          error: function (response, status, error) {
            $.alert(response.responseText);
          },
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
    title: "Delete personnel",
    content: "Delete this personnel?",
    buttons: {
      confirm: function () {
        $.ajax({
          url: "libs/php/deletePersonnel.php",
          type: "POST",
          cache: false,
          data: {
            id: id,
          },
          success: function (data) {
            var stringify = JSON.stringify(data);
            var json = JSON.parse(stringify);
            if (json.status["code"] !== "200") {
              $.alert("Personnel cannot be deleted.");
              return;
            }
            element.fadeOut().remove();
            $.alert("Personnel has been deleted!");
            $("#searchForm").trigger("reset");
            getAll();
          },
        });
      },
      cancel: function () {
        return;
      },
    },
  });
}
function createLocation() {
  $.ajax({
    url: "libs/php/addLocation.php",
    type: "POST",
    cache: false,
    data: $("#addNewLocation").serialize(),
    success: function (result) {
      var json = JSON.parse(result);
      var data = json.status;

      if (data.code === "400") {
        $.alert(data.description);
        $("#addNewLocation").trigger("reset");
        return;
      }
      locationList();
      $("#addNewLocation").trigger("reset");
    },
    error: function (req, status, err) {
      console.log(req.responseText);
    },
  });
}
function updateLocation(id) {
  $.ajax({
    url: "libs/php/updateLocation.php",
    type: "POST",
    cache: false,
    data:
      $(`.form-loc[data-id="${id}"]`).serialize() +
      `&id=${$(`.form-loc[data-id="${id}"]`).data("id")}`,
    success: function (result) {
      locationList();
      getAll();
    },
    error: function (req, status, error) {
      console.log(req.responseText);
    },
  });
}
function deleteLocation(id) {
  $.ajax({
    url: "libs/php/deleteLocation.php",
    type: "POST",
    data: {
      id: id,
    },
    success: function (result) {
      var json = JSON.parse(result);
      var status = json.status;
      if (status.code === "400") {
        $.alert(status.description);
        return;
      }
      locationList();
    },
    error: function (req, status, err) {
      console.log(req.responseText);
    },
  });
}

function locationList() {
  $("#locationsList").empty();
  $.ajax({
    url: "libs/php/getLocations.php",
    dataType: "json",
    success: function (result) {
      var data = result.data;

      data.forEach((e) => {
        $("#locationsList").append(`
        <form class="row g-2 p-1 form-loc"  data-id="${e.id}">
        <div class="col ">
            
                <input name="l-name" type="text" class="form-control name-location" placeholder="Location" aria-label="Department" data-id="${e.id}" value="${e.name}" disabled required>
            
        </div>
        
        
          <div class="col-sm pb-2 pb-sm-0 btn-group btn-group-sm" role="group" aria-label="Basic outlined example">
            <button type="button" class="btn btn-outline-secondary btn-sm editL" data-id="${e.id}">Edit</button>
            <button type="submit" name="deleteL" class="btn btn-outline-danger btn-sm deleteL submit-btn" data-id="${e.id}">Delete</button>
          
          </div>
          <div class="d-none col-sm pb-2 pb-sm-0 btn-group btn-group-sm" role="group" aria-label="Basic outlined example">
            <button type="submit" name="saveL" class="btn btn-success btn-sm saveL submit-btn" data-id="${e.id}">Save</button>
            <button type="button" class="btn btn-outline-secondary btn-sm cancelL" data-id="${e.id}">Cancel</button>
          </div>
          <hr class="d-sm-none">
         </form>
        `);
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
      var stringify = JSON.stringify(result);
      var json = JSON.parse(stringify);
      let data = json.data.personnel;
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
