// swagger-config.js
export const swaggerDocument = {
  "openapi": "3.0.0",
  "info": {
    "title": "Open API KCAF",
    "version": "1.0.0",
    "description": "API for managing zones, collecteurs, and batiments data - Read Only",
    "contact": {
      "name": "API Support",
      "email": "support@eclinic.com"
    },
    "license": {
      "name": "MIT",
      "url": "https://spdx.org/licenses/MIT.html"
    }
  },
  "servers": [
    {
      "url": "https://open-api-0jb2.onrender.com",
      "description": "Production server"
    },
    {
      "url": "http://localhost:4000",
      "description": "Development server"
    }
  ],
  "tags": [
    {
      "name": "Zones",
      "description": "Zones management API"
    },
    {
      "name": "Collecteurs",
      "description": "Collecteurs management API"
    },
    {
      "name": "Batiments",
      "description": "Batiments management API"
    }
  ],
  "paths": {
    // ===== ZONES ENDPOINTS =====
    "/zones": {
      "get": {
        "summary": "Get all zones with optional filters",
        "description": "Retrieve a paginated list of zones with filtering and sorting options",
        "tags": ["Zones"],
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "search",
            "in": "query",
            "description": "Search term for name or lots",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "page",
            "in": "query",
            "description": "Page number",
            "schema": {
              "type": "integer",
              "minimum": 1,
              "default": 1
            }
          },
          {
            "name": "limit",
            "in": "query",
            "description": "Number of items per page",
            "schema": {
              "type": "integer",
              "minimum": 1,
              "maximum": 200,
              "default": 50
            }
          },
          {
            "name": "sort_by",
            "in": "query",
            "description": "Sort column",
            "schema": {
              "type": "string",
              "enum": ["id", "name", "created_at", "updated_at"],
              "default": "id"
            }
          },
          {
            "name": "sort_order",
            "in": "query",
            "description": "Sort order",
            "schema": {
              "type": "string",
              "enum": ["ASC", "DESC"],
              "default": "ASC"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "data": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/Zone"
                      }
                    },
                    "pagination": {
                      "$ref": "#/components/schemas/Pagination"
                    }
                  }
                }
              }
            }
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        }
      }
    },
    "/zones/{id}": {
      "get": {
        "summary": "Get zone by ID with details",
        "description": "Retrieve a specific zone by its ID with collecteurs information",
        "tags": ["Zones"],
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "description": "Zone ID",
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ZoneWithCollecteurs"
                }
              }
            }
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        }
      }
    },
    "/zones/stats": {
      "get": {
        "summary": "Get zones statistics",
        "description": "Retrieve overall statistics about zones",
        "tags": ["Zones"],
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ZonesStats"
                }
              }
            }
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        }
      }
    },
    "/zones/search/{term}": {
      "get": {
        "summary": "Search zones by term",
        "description": "Search zones by name or lots",
        "tags": ["Zones"],
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "term",
            "in": "path",
            "required": true,
            "description": "Search term",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "page",
            "in": "query",
            "description": "Page number",
            "schema": {
              "type": "integer",
              "minimum": 1,
              "default": 1
            }
          },
          {
            "name": "limit",
            "in": "query",
            "description": "Number of items per page",
            "schema": {
              "type": "integer",
              "minimum": 1,
              "maximum": 100,
              "default": 20
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "data": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/Zone"
                      }
                    },
                    "search_term": {
                      "type": "string"
                    },
                    "pagination": {
                      "$ref": "#/components/schemas/Pagination"
                    }
                  }
                }
              }
            }
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        }
      }
    },
    "/zones/with-stats": {
      "get": {
        "summary": "Get zones with detailed statistics",
        "description": "Retrieve zones with comprehensive statistics including collecteurs and batiments counts",
        "tags": ["Zones"],
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "page",
            "in": "query",
            "description": "Page number",
            "schema": {
              "type": "integer",
              "minimum": 1,
              "default": 1
            }
          },
          {
            "name": "limit",
            "in": "query",
            "description": "Number of items per page",
            "schema": {
              "type": "integer",
              "minimum": 1,
              "maximum": 200,
              "default": 50
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "data": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/ZoneWithStats"
                      }
                    },
                    "pagination": {
                      "$ref": "#/components/schemas/Pagination"
                    }
                  }
                }
              }
            }
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        }
      }
    },

    // ===== COLLECTEURS ENDPOINTS =====
    "/collecteurs": {
      "get": {
        "summary": "Get all collecteurs with optional filters",
        "description": "Retrieve a paginated list of collecteurs with filtering options",
        "tags": ["Collecteurs"],
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "zone_id",
            "in": "query",
            "description": "Filter by zone ID",
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "city",
            "in": "query",
            "description": "Filter by city name",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "statut",
            "in": "query",
            "description": "Filter by status",
            "schema": {
              "type": "string",
              "enum": ["actif", "inactif"]
            }
          },
          {
            "name": "lot",
            "in": "query",
            "description": "Filter by lot",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "search",
            "in": "query",
            "description": "Search term for name, numero_collecteur, or phone",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "page",
            "in": "query",
            "description": "Page number",
            "schema": {
              "type": "integer",
              "minimum": 1,
              "default": 1
            }
          },
          {
            "name": "limit",
            "in": "query",
            "description": "Number of items per page",
            "schema": {
              "type": "integer",
              "minimum": 1,
              "maximum": 200,
              "default": 50
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "data": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/Collecteur"
                      }
                    },
                    "pagination": {
                      "$ref": "#/components/schemas/Pagination"
                    }
                  }
                }
              }
            }
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        }
      }
    },
    "/collecteurs/{id}": {
      "get": {
        "summary": "Get collecteur by ID",
        "description": "Retrieve a specific collecteur by its ID",
        "tags": ["Collecteurs"],
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "description": "Collecteur ID",
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Collecteur"
                }
              }
            }
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        }
      }
    },
    "/collecteurs/stats": {
      "get": {
        "summary": "Get collecteurs statistics",
        "description": "Retrieve overall statistics about collecteurs",
        "tags": ["Collecteurs"],
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "zone_id",
            "in": "query",
            "description": "Filter by zone ID",
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CollecteursStats"
                }
              }
            }
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        }
      }
    },
    "/collecteurs/by-zone/{zone_id}": {
      "get": {
        "summary": "Get collecteurs by zone",
        "description": "Retrieve collecteurs filtered by zone ID",
        "tags": ["Collecteurs"],
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "zone_id",
            "in": "path",
            "required": true,
            "description": "Zone ID",
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "page",
            "in": "query",
            "description": "Page number",
            "schema": {
              "type": "integer",
              "minimum": 1,
              "default": 1
            }
          },
          {
            "name": "limit",
            "in": "query",
            "description": "Number of items per page",
            "schema": {
              "type": "integer",
              "minimum": 1,
              "maximum": 200,
              "default": 50
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "data": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/Collecteur"
                      }
                    },
                    "pagination": {
                      "$ref": "#/components/schemas/Pagination"
                    }
                  }
                }
              }
            }
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        }
      }
    },
    "/collecteurs/search/{term}": {
      "get": {
        "summary": "Search collecteurs by term",
        "description": "Search collecteurs by name, numero_collecteur, phone, or lot",
        "tags": ["Collecteurs"],
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "term",
            "in": "path",
            "required": true,
            "description": "Search term",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "page",
            "in": "query",
            "description": "Page number",
            "schema": {
              "type": "integer",
              "minimum": 1,
              "default": 1
            }
          },
          {
            "name": "limit",
            "in": "query",
            "description": "Number of items per page",
            "schema": {
              "type": "integer",
              "minimum": 1,
              "maximum": 100,
              "default": 20
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "data": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/Collecteur"
                      }
                    },
                    "search_term": {
                      "type": "string"
                    },
                    "pagination": {
                      "$ref": "#/components/schemas/Pagination"
                    }
                  }
                }
              }
            }
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        }
      }
    },

    // ===== BATIMENTS ENDPOINTS =====
    "/batiments": {
      "get": {
        "summary": "Get all batiments with optional filters",
        "description": "Retrieve a paginated list of batiments with filtering and sorting options",
        "tags": ["Batiments"],
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "zone_id",
            "in": "query",
            "description": "Filter by zone ID",
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "collecteur_id",
            "in": "query",
            "description": "Filter by collecteur ID",
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "city",
            "in": "query",
            "description": "Filter by city name",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "statut",
            "in": "query",
            "description": "Filter by status",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "survey_status",
            "in": "query",
            "description": "Filter by survey status",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "progression",
            "in": "query",
            "description": "Filter by progression",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "search",
            "in": "query",
            "description": "Search term for code, nom_batiment, adresse, ville, or occupant",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "page",
            "in": "query",
            "description": "Page number",
            "schema": {
              "type": "integer",
              "minimum": 1,
              "default": 1
            }
          },
          {
            "name": "limit",
            "in": "query",
            "description": "Number of items per page",
            "schema": {
              "type": "integer",
              "minimum": 1,
              "maximum": 1000,
              "default": 50
            }
          },
          {
            "name": "sort_by",
            "in": "query",
            "description": "Sort column",
            "schema": {
              "type": "string",
              "enum": ["id", "code", "nom_batiment", "ville", "created_at", "updated_at"],
              "default": "id"
            }
          },
          {
            "name": "sort_order",
            "in": "query",
            "description": "Sort order",
            "schema": {
              "type": "string",
              "enum": ["ASC", "DESC"],
              "default": "ASC"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "data": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/Batiment"
                      }
                    },
                    "pagination": {
                      "$ref": "#/components/schemas/Pagination"
                    }
                  }
                }
              }
            }
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        }
      }
    },
    "/batiments/{id}": {
      "get": {
        "summary": "Get batiment by ID with details",
        "description": "Retrieve a specific batiment by its ID with zone and collecteur information",
        "tags": ["Batiments"],
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "description": "Batiment ID",
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BatimentWithDetails"
                }
              }
            }
          },
          "404": {
            "$ref": "#/components/responses/NotFound"
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        }
      }
    },
    "/batiments/stats": {
      "get": {
        "summary": "Get batiments statistics",
        "description": "Retrieve overall statistics about batiments",
        "tags": ["Batiments"],
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "zone_id",
            "in": "query",
            "description": "Filter by zone ID",
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "collecteur_id",
            "in": "query",
            "description": "Filter by collecteur ID",
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BatimentsStats"
                }
              }
            }
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        }
      }
    },
    "/batiments/by-zone/{zone_id}": {
      "get": {
        "summary": "Get batiments by zone",
        "description": "Retrieve batiments filtered by zone ID",
        "tags": ["Batiments"],
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "zone_id",
            "in": "path",
            "required": true,
            "description": "Zone ID",
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "page",
            "in": "query",
            "description": "Page number",
            "schema": {
              "type": "integer",
              "minimum": 1,
              "default": 1
            }
          },
          {
            "name": "limit",
            "in": "query",
            "description": "Number of items per page",
            "schema": {
              "type": "integer",
              "minimum": 1,
              "maximum": 1000,
              "default": 100
            }
          },
          {
            "name": "statut",
            "in": "query",
            "description": "Filter by status",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "data": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/Batiment"
                      }
                    },
                    "pagination": {
                      "$ref": "#/components/schemas/Pagination"
                    }
                  }
                }
              }
            }
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        }
      }
    },
    "/batiments/by-collecteur/{collecteur_id}": {
      "get": {
        "summary": "Get batiments by collecteur",
        "description": "Retrieve batiments filtered by collecteur ID",
        "tags": ["Batiments"],
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "collecteur_id",
            "in": "path",
            "required": true,
            "description": "Collecteur ID",
            "schema": {
              "type": "integer"
            }
          },
          {
            "name": "page",
            "in": "query",
            "description": "Page number",
            "schema": {
              "type": "integer",
              "minimum": 1,
              "default": 1
            }
          },
          {
            "name": "limit",
            "in": "query",
            "description": "Number of items per page",
            "schema": {
              "type": "integer",
              "minimum": 1,
              "maximum": 1000,
              "default": 100
            }
          },
          {
            "name": "statut",
            "in": "query",
            "description": "Filter by status",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "data": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/Batiment"
                      }
                    },
                    "pagination": {
                      "$ref": "#/components/schemas/Pagination"
                    }
                  }
                }
              }
            }
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        }
      }
    },
    "/batiments/search/{term}": {
      "get": {
        "summary": "Search batiments by term",
        "description": "Search batiments by code, nom_batiment, adresse, ville, occupant, or quartier",
        "tags": ["Batiments"],
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "term",
            "in": "path",
            "required": true,
            "description": "Search term",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "page",
            "in": "query",
            "description": "Page number",
            "schema": {
              "type": "integer",
              "minimum": 1,
              "default": 1
            }
          },
          {
            "name": "limit",
            "in": "query",
            "description": "Number of items per page",
            "schema": {
              "type": "integer",
              "minimum": 1,
              "maximum": 200,
              "default": 50
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "data": {
                      "type": "array",
                      "items": {
                        "$ref": "#/components/schemas/Batiment"
                      }
                    },
                    "search_term": {
                      "type": "string"
                    },
                    "pagination": {
                      "$ref": "#/components/schemas/Pagination"
                    }
                  }
                }
              }
            }
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        }
      }
    },
    "/batiments/cities": {
      "get": {
        "summary": "Get unique cities from batiments",
        "description": "Retrieve a list of unique cities with counts from batiments",
        "tags": ["Batiments"],
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/City"
                  }
                }
              }
            }
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        }
      }
    },
    "/batiments/progression-summary": {
      "get": {
        "summary": "Get progression summary",
        "description": "Retrieve progression summary with counts and percentages",
        "tags": ["Batiments"],
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "zone_id",
            "in": "query",
            "description": "Filter by zone ID",
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful operation",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/ProgressionSummary"
                  }
                }
              }
            }
          },
          "401": {
            "$ref": "#/components/responses/Unauthorized"
          },
          "500": {
            "$ref": "#/components/responses/InternalError"
          }
        }
      }
    }
  },
  "components": {
    "securitySchemes": {
      "ApiKeyAuth": {
        "type": "apiKey",
        "in": "header",
        "name": "x-api-key",
        "description": "API Key for authentication"
      }
    },
    "schemas": {
      // Zone schemas
      "Zone": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "example": 1
          },
          "name": {
            "type": "string",
            "example": "Zone Nord"
          },
          "lots": {
            "type": "string",
            "example": "LOT-A,LOT-B"
          },
          "collecteurs_count": {
            "type": "integer",
            "example": 5
          },
          "batiments_count": {
            "type": "integer",
            "example": 150
          },
          "created_at": {
            "type": "string",
            "format": "date-time",
            "example": "2024-01-01T00:00:00.000Z"
          },
          "updated_at": {
            "type": "string",
            "format": "date-time",
            "example": "2024-01-15T10:30:00.000Z"
          }
        }
      },
      "ZoneWithCollecteurs": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "example": 1
          },
          "name": {
            "type": "string",
            "example": "Zone Nord"
          },
          "lots": {
            "type": "string",
            "example": "LOT-A,LOT-B"
          },
          "collecteurs_count": {
            "type": "integer",
            "example": 5
          },
          "batiments_count": {
            "type": "integer",
            "example": 150
          },
          "derniere_activite": {
            "type": "string",
            "format": "date-time",
            "example": "2024-01-15T10:30:00.000Z"
          },
          "collecteurs": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/CollecteurWithProgress"
            }
          }
        }
      },
      "ZoneWithStats": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "example": 1
          },
          "name": {
            "type": "string",
            "example": "Zone Nord"
          },
          "lots": {
            "type": "string",
            "example": "LOT-A,LOT-B"
          },
          "collecteurs_count": {
            "type": "integer",
            "example": 5
          },
          "collecteurs_actifs": {
            "type": "integer",
            "example": 4
          },
          "batiments_count": {
            "type": "integer",
            "example": 150
          },
          "total_batiments_validees": {
            "type": "integer",
            "example": 120
          },
          "total_batiments_planned": {
            "type": "integer",
            "example": 150
          },
          "avancement_percent": {
            "type": "integer",
            "example": 80
          },
          "derniere_activite": {
            "type": "string",
            "format": "date-time",
            "example": "2024-01-15T10:30:00.000Z"
          }
        }
      },
      "ZonesStats": {
        "type": "object",
        "properties": {
          "total_zones": {
            "type": "integer",
            "example": 10
          },
          "zones_with_lots": {
            "type": "integer",
            "example": 8
          },
          "total_collecteurs": {
            "type": "integer",
            "example": 50
          },
          "total_batiments": {
            "type": "integer",
            "example": 5000
          },
          "collecteurs_actifs": {
            "type": "integer",
            "example": 45
          }
        }
      },

      // Collecteur schemas
      "Collecteur": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "example": 1
          },
          "name": {
            "type": "string",
            "example": "John Doe"
          },
          "numero_collecteur": {
            "type": "string",
            "example": "COL-001"
          },
          "phone": {
            "type": "string",
            "example": "+1234567890"
          },
          "statut": {
            "type": "string",
            "enum": ["actif", "inactif"],
            "example": "actif"
          },
          "lot": {
            "type": "string",
            "example": "LOT-A"
          },
          "batiments_total": {
            "type": "integer",
            "example": 150
          },
          "batiments_validee": {
            "type": "integer",
            "example": 120
          },
          "avancement_percent": {
            "type": "integer",
            "example": 80
          },
          "derniere_activite": {
            "type": "string",
            "format": "date-time",
            "example": "2024-01-15T10:30:00.000Z"
          },
          "created_at": {
            "type": "string",
            "format": "date-time",
            "example": "2024-01-01T00:00:00.000Z"
          },
          "updated_at": {
            "type": "string",
            "format": "date-time",
            "example": "2024-01-15T10:30:00.000Z"
          },
          "zone": {
            "type": "object",
            "properties": {
              "id": {
                "type": "integer",
                "example": 1
              },
              "name": {
                "type": "string",
                "example": "Zone Nord"
              }
            }
          }
        }
      },
      "CollecteurWithProgress": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "example": 1
          },
          "name": {
            "type": "string",
            "example": "John Doe"
          },
          "numero_collecteur": {
            "type": "string",
            "example": "COL-001"
          },
          "statut": {
            "type": "string",
            "example": "actif"
          },
          "batiments_total": {
            "type": "integer",
            "example": 150
          },
          "batiments_validee": {
            "type": "integer",
            "example": 120
          },
          "actual_batiments_count": {
            "type": "integer",
            "example": 120
          },
          "avancement_percent": {
            "type": "integer",
            "example": 80
          }
        }
      },
      "CollecteursStats": {
        "type": "object",
        "properties": {
          "total_collecteurs": {
            "type": "integer",
            "example": 50
          },
          "actifs": {
            "type": "integer",
            "example": 45
          },
          "inactifs": {
            "type": "integer",
            "example": 5
          },
          "total_batiments": {
            "type": "integer",
            "example": 5000
          },
          "total_batiments_validees": {
            "type": "integer",
            "example": 4000
          },
          "avg_avancement": {
            "type": "number",
            "format": "float",
            "example": 80.5
          }
        }
      },

      // Batiment schemas
      "Batiment": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "example": 1
          },
          "code": {
            "type": "string",
            "example": "BAT-001"
          },
          "nom_batiment": {
            "type": "string",
            "example": "Immeuble Résidentiel"
          },
          "adresse": {
            "type": "string",
            "example": "123 Rue Principale"
          },
          "ville": {
            "type": "string",
            "example": "Paris"
          },
          "quartier": {
            "type": "string",
            "example": "Centre-ville"
          },
          "occupant": {
            "type": "string",
            "example": "Jean Dupont"
          },
          "statut": {
            "type": "string",
            "example": "actif"
          },
          "survey_status": {
            "type": "string",
            "example": "completed"
          },
          "progression": {
            "type": "string",
            "example": "completed"
          },
          "surface_habitable": {
            "type": "number",
            "format": "float",
            "example": 120.5
          },
          "zone_name": {
            "type": "string",
            "example": "Zone Nord"
          },
          "collecteur_name": {
            "type": "string",
            "example": "John Doe"
          },
          "collecteur_numero": {
            "type": "string",
            "example": "COL-001"
          },
          "created_at": {
            "type": "string",
            "format": "date-time",
            "example": "2024-01-01T00:00:00.000Z"
          },
          "updated_at": {
            "type": "string",
            "format": "date-time",
            "example": "2024-01-15T10:30:00.000Z"
          }
        }
      },
      "BatimentWithDetails": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "example": 1
          },
          "code": {
            "type": "string",
            "example": "BAT-001"
          },
          "nom_batiment": {
            "type": "string",
            "example": "Immeuble Résidentiel"
          },
          "adresse": {
            "type": "string",
            "example": "123 Rue Principale"
          },
          "ville": {
            "type": "string",
            "example": "Paris"
          },
          "quartier": {
            "type": "string",
            "example": "Centre-ville"
          },
          "occupant": {
            "type": "string",
            "example": "Jean Dupont"
          },
          "statut": {
            "type": "string",
            "example": "actif"
          },
          "survey_status": {
            "type": "string",
            "example": "completed"
          },
          "progression": {
            "type": "string",
            "example": "completed"
          },
          "surface_habitable": {
            "type": "number",
            "format": "float",
            "example": 120.5
          },
          "zone_name": {
            "type": "string",
            "example": "Zone Nord"
          },
          "collecteur_name": {
            "type": "string",
            "example": "John Doe"
          },
          "collecteur_numero": {
            "type": "string",
            "example": "COL-001"
          },
          "collecteur_phone": {
            "type": "string",
            "example": "+1234567890"
          },
          "created_at": {
            "type": "string",
            "format": "date-time",
            "example": "2024-01-01T00:00:00.000Z"
          },
          "updated_at": {
            "type": "string",
            "format": "date-time",
            "example": "2024-01-15T10:30:00.000Z"
          }
        }
      },
      "BatimentsStats": {
        "type": "object",
        "properties": {
          "total_batiments": {
            "type": "integer",
            "example": 5000
          },
          "actifs": {
            "type": "integer",
            "example": 4500
          },
          "inactifs": {
            "type": "integer",
            "example": 500
          },
          "survey_completed": {
            "type": "integer",
            "example": 4000
          },
          "survey_pending": {
            "type": "integer",
            "example": 1000
          },
          "progression_completed": {
            "type": "integer",
            "example": 3500
          },
          "progression_in_progress": {
            "type": "integer",
            "example": 1500
          },
          "avg_surface": {
            "type": "number",
            "format": "float",
            "example": 120.5
          },
          "max_surface": {
            "type": "number",
            "format": "float",
            "example": 500.0
          },
          "min_surface": {
            "type": "number",
            "format": "float",
            "example": 50.0
          }
        }
      },
      "City": {
        "type": "object",
        "properties": {
          "city": {
            "type": "string",
            "example": "Paris"
          },
          "count": {
            "type": "integer",
            "example": 1500
          }
        }
      },
      "ProgressionSummary": {
        "type": "object",
        "properties": {
          "progression": {
            "type": "string",
            "example": "completed"
          },
          "count": {
            "type": "integer",
            "example": 3500
          },
          "percentage": {
            "type": "number",
            "format": "float",
            "example": 70.0
          }
        }
      },

      // Common schemas
      "Pagination": {
        "type": "object",
        "properties": {
          "page": {
            "type": "integer",
            "example": 1
          },
          "limit": {
            "type": "integer",
            "example": 50
          },
          "total": {
            "type": "integer",
            "example": 100
          },
          "totalPages": {
            "type": "integer",
            "example": 2
          }
        }
      },
      "Error": {
        "type": "object",
        "properties": {
          "error": {
            "type": "string",
            "example": "Error message description"
          }
        }
      }
    },
    "responses": {
      "NotFound": {
        "description": "Resource not found",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Error"
            },
            "example": {
              "error": "Resource not found"
            }
          }
        }
      },
      "Unauthorized": {
        "description": "API key missing or invalid",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Error"
            },
            "example": {
              "error": "API key required"
            }
          }
        }
      },
      "InternalError": {
        "description": "Internal server error",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Error"
            },
            "example": {
              "error": "Internal server error"
            }
          }
        }
      }
    }
  },
  "security": [
    {
      "ApiKeyAuth": []
    }
  ]
};