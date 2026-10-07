import { useContext } from "react";
import { DocumentContext } from "../providers/DocumentProvider";


export function useDocuments() {
    return useContext(DocumentContext)
}
