// @ts-nocheck

'use client'

import { createContext, useState } from "react"

export const DocumentContext = createContext(null);

export function DocumentProvider({ children }) {
    const [documents, setDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);

    return (

        <DocumentContext.Provider
            value={{
                documents,
                setDocuments,
                selectedDocument,
                setSelectedDocument
            }}
        >

            {children}
        </DocumentContext.Provider>
    );

}
