const mongoose = require('mongoose');

const Role = mongoose.model('Role');

module.exports.createRole = (req, res, next) => {
  try {
    const role = new Role();

    role.role = req.body.role;
    role.scope = req.body.scope;
    role.save((errRole, docRole) => {
      if(!errRole) {
        return res.send({
          'success' : true,
          'message' : 'Role Created Successfully!',
          'role'    : docRole
        });
      } else {
        if(errRole.code == 11000) {
          return next({
            status  : 422,
            message : 'This role is already there'
          });
        } else {
          return next(errRole);
        }
      }
    });
  } catch (error) {
    return next({
      status  : 500,
      errors  : error,
      title   : 'Internal server Error!',
      message : 'Sorry, due to an internal error, we could not update role at this time.'
    });
  }
};
module.exports.getRoles = (req, res, next) => {
  try {
    Role.find({}, (errRole, docRole) => {
      if(!errRole) {
        return res.send({
          'success' : true,
          'message' : 'All Roles Data Sent Successfully!',
          'roles'   : docRole
        });
      } else {
        return next(errRole);
      }
    });
  } catch (error) {
    return next({
      status  : 500,
      errors  : error,
      title   : 'Internal server Error!',
      message : 'Sorry, due to an internal error, we could not update role at this time.'
    });
  }
};
module.exports.getRoleById = (req, res, next) => {
  try {
    const _id = req.params.id;

    Role.findById(_id, (errRole, docRole) => {
      if(!errRole) {
        return res.send({
          'success' : true,
          'message' : 'Role Data Sent Successfully!',
          'role'    : docRole
        });
      } else {
        return next(errRole);
      }
    });
  } catch (error) {
    return next({
      status  : 500,
      errors  : error,
      title   : 'Internal server Error!',
      message : 'Sorry, due an internal error, we could not update role at this time.'
    });
  }
};
module.exports.updateRoleById = (req, res, next) => {
  try {
    const _id = req.params.id;

    const role = {
      'role'  : req.body.role,
      'scope' : req.body.scope
    };

    Role.findByIdAndUpdate(_id, role, { new: true }, (errRole, docRole) => {
      if(!errRole) {
        return res.send({
          'success' : true,
          'message' : 'Role Updated Successfully!',
          'role'    : docRole,
        });
      } else {
        return next(errRole);
      }
    });
  } catch (error) {
    return next({
      status  : 500,
      errors  : error,
      title   : 'Internal server Error!',
      message : 'Sorry, due an internal error, we could not update role at this time.'
    });
  }
};
module.exports.deleteRoleById = (req, res, next) => {
  try {
    const _id = req.params.id;

    Role.findByIdAndRemove(_id, (errRole, docRole) => {
      if(!errRole) {
        return res.send({
          'success' : true,
          'message' : 'Role Deleted Successfully!',
          'role'    : docRole
        });
      } else {
        return next(errRole);
      }
    });
  } catch (error) {
    return next({
      status  : 500,
      errors  : error,
      title   : 'Internal server Error!',
      message : 'Sorry, due an internal error, we could not update role at this time.'
    });
  }
};