import { gql } from "@apollo/client";

export const getUsers = gql`
query allUser{
    allUsers{
      id
      name
      category
      image
      date
    }
  }
`;