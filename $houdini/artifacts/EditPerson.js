export default {
    name: "EditPerson",
    kind: "HoudiniMutation",
    hash: "cdd4267d26923dcb4d1d5858dc189c1937823d0d76cd0d932f00b017eecc7943",

    raw: `mutation EditPerson($id: Int!, $data: auth_person_set_input!) {
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
      note
      id
      created
      modified
      bankaccount
      key_code
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

                                    note: {
                                        type: "String",
                                        keyRaw: "note",
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
                                    },

                                    key_code: {
                                        type: "String",
                                        keyRaw: "key_code",
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

"HoudiniHash=f234c72edf59bdfe88b5b88f4e9fb1ec4c605df726cd49f78b42807c1a26c08d";