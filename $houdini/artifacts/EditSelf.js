export default {
    name: "EditSelf",
    kind: "HoudiniMutation",
    hash: "d8eed9d0ea056e39382c4627aac9d67e0d595a7f1b98c1a3dc75af317f9e1547",

    raw: `mutation EditSelf($id: Int!, $data: auth_person_set_input!) {
  person: update_auth_person(where: {id: {_eq: $id}}, _set: $data) {
    returning {
      name
      firstname
      lastname
      email
      phone
      address
      zipcode
      city
      country
      id
      created
      modified
      bankaccount
    }
  }
}
`,

    rootType: "mutation_root",

    selection: {
        fields: {
            person: {
                type: "auth_person_mutation_response",
                keyRaw: "person(_set: $data, where: {id: {_eq: $id}})",
                nullable: true,

                selection: {
                    fields: {
                        returning: {
                            type: "auth_person",
                            keyRaw: "returning",

                            selection: {
                                fields: {
                                    name: {
                                        type: "String",
                                        keyRaw: "name"
                                    },

                                    firstname: {
                                        type: "String",
                                        keyRaw: "firstname",
                                        nullable: true
                                    },

                                    lastname: {
                                        type: "String",
                                        keyRaw: "lastname",
                                        nullable: true
                                    },

                                    email: {
                                        type: "String",
                                        keyRaw: "email",
                                        nullable: true
                                    },

                                    phone: {
                                        type: "String",
                                        keyRaw: "phone",
                                        nullable: true
                                    },

                                    address: {
                                        type: "String",
                                        keyRaw: "address",
                                        nullable: true
                                    },

                                    zipcode: {
                                        type: "String",
                                        keyRaw: "zipcode",
                                        nullable: true
                                    },

                                    city: {
                                        type: "String",
                                        keyRaw: "city",
                                        nullable: true
                                    },

                                    country: {
                                        type: "String",
                                        keyRaw: "country",
                                        nullable: true
                                    },

                                    id: {
                                        type: "Int",
                                        keyRaw: "id"
                                    },

                                    created: {
                                        type: "timestamptz",
                                        keyRaw: "created",
                                        nullable: true
                                    },

                                    modified: {
                                        type: "timestamptz",
                                        keyRaw: "modified",
                                        nullable: true
                                    },

                                    bankaccount: {
                                        type: "String",
                                        keyRaw: "bankaccount",
                                        nullable: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    input: {
        fields: {
            id: "Int",
            data: "auth_person_set_input"
        },

        types: {
            auth_person_set_input: {
                address: "String",
                bankaccount: "String",
                city: "String",
                country: "String",
                created: "timestamptz",
                email: "String",
                firstname: "String",
                id: "Int",
                key_code: "String",
                lastname: "String",
                modified: "timestamptz",
                name: "String",
                note: "String",
                password: "String",
                phone: "String",
                zipcode: "String"
            }
        }
    }
};

"HoudiniHash=1ab32724faf6d2a0f805911141cda0b282b974adb38f905f50d46af36b88d159";