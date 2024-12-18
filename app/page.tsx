"use client";

import { useState } from "react";
import { JsonForms } from "@jsonforms/react";
import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";
import { JsonFormsCore } from '@jsonforms/core';

const defaultSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "Please enter your full name"
    },
    email: {
      type: "string",
      format: "email",
      description: "Please enter your email"
    },
    age: {
      type: "integer",
      description: "Please enter your age"
    },
    preferences: {
      type: "object",
      properties: {
        newsletter: {
          type: "boolean",
          description: "Subscribe to newsletter"
        },
        color: {
          type: "string",
          enum: ["red", "green", "blue"],
          description: "Favorite color"
        }
      }
    },
    hobbies: {
      type: "array",
      items: {
        type: "string"
      },
      description: "Enter your hobbies"
    }
  },
  required: ["name", "email"]
};

const defaultUiSchema = {
  elements: [
    {
      type: "Group",
      label: "Personal Information",
      elements: [
        {
          type: "Control",
          scope: "#/properties/name"
        },
        {
          type: "Control",
          scope: "#/properties/email"
        },
        {
          type: "Control",
          scope: "#/properties/age"
        }
      ]
    },
    {
      type: "Group",
      label: "Preferences",
      elements: [
        {
          type: "Control",
          scope: "#/properties/preferences"
        }
      ]
    },
    {
      type: "Group",
      label: "Interests",
      elements: [
        {
          type: "Control",
          scope: "#/properties/hobbies"
        }
      ]
    }
  ]
};

export default function Home() {
  const [schema, setSchema] = useState(JSON.stringify(defaultSchema, null, 2));
  const [uiSchema, setUiSchema] = useState(JSON.stringify(defaultUiSchema, null, 2));
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [error, setError] = useState<string | null>(null);

  const handleSchemaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSchema(e.target.value);
    try {
      JSON.parse(e.target.value);
      setError(null);
    } catch {
      setError("Invalid JSON in schema");
    }
  };

  const handleUiSchemaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUiSchema(e.target.value);
    try {
      JSON.parse(e.target.value);
      setError(null);
    } catch {
      setError("Invalid JSON in UI schema");
    }
  };

  const handleFormChange = ({ data, errors }: Pick<JsonFormsCore, 'data' | 'errors'>) => {
    setFormData(data);
    console.log('Form Data:', data);
    console.log('Validation Errors:', errors);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Schema Editors */}
      <div className="w-1/2 p-6 border-r border-gray-200 overflow-auto">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">JSON Schema</h2>
            <textarea
              value={schema}
              onChange={handleSchemaChange}
              className="w-full h-[300px] font-mono text-sm p-4 border rounded-md"
              spellCheck="false"
            />
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2">UI Schema (Optional)</h2>
            <textarea
              value={uiSchema}
              onChange={handleUiSchemaChange}
              className="w-full h-[300px] font-mono text-sm p-4 border rounded-md"
              spellCheck="false"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Form Preview */}
      <div className="w-1/2 p-6 overflow-auto">
        <h2 className="text-lg font-semibold mb-6">Form Preview</h2>
        
        <div className="mb-8">
          {!error && (
            <JsonForms
              schema={JSON.parse(schema)}
              uischema={uiSchema ? JSON.parse(uiSchema) : undefined}
              data={formData}
              renderers={materialRenderers}
              cells={materialCells}
              onChange={handleFormChange}
            />
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Form Data:</h3>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
