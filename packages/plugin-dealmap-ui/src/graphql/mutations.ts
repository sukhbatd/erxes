const add = `
  mutation dealmapsAdd($name: String!, $expiryDate: Date, $typeId:String) {
    dealmapsAdd(name:$name, expiryDate: $expiryDate, typeId:$typeId) {
      name
      _id
      expiryDate
      typeId
    }
  }
`;

const remove = `
  mutation dealmapsRemove($_id: String!){
    dealmapsRemove(_id: $_id)
  }
  `;

const edit = `
  mutation dealmapsEdit($_id: String!, $name:String, $expiryDate:Date, $checked:Boolean, $typeId:String){
    dealmapsEdit(_id: $_id, name: $name, expiryDate:$expiryDate, checked:$checked, typeId:$typeId){
      _id
    }
  }
  `;

const addType = `
  mutation typesAdd($name: String!){
    dealmapTypesAdd(name:$name){
      name
      _id
    }
  }
  `;

const removeType = `
  mutation typesRemove($_id:String!){
    dealmapTypesRemove(_id:$_id)
  }
`;

const editType = `
  mutation typesEdit($_id: String!, $name:String){
    dealmapTypesEdit(_id: $_id, name: $name){
      _id
    }
  }
`;

export default {
  add,
  remove,
  edit,
  addType,
  removeType,
  editType
};
