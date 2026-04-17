import path from 'path';
import { fileURLToPath } from 'url';

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'my-first-pro 接口文档',
    version: '1.0.0',
    description: '当前 Node.js + Express 后端项目的 OpenAPI 接口文档。'
  },
  servers: [
    {
      url: '/',
      description: '当前服务地址'
    }
  ],
  tags: [
    {
      name: 'Auth',
      description: '认证相关接口'
    },
    {
      name: 'System',
      description: '系统和健康检查接口'
    },
    {
      name: 'User',
      description: '用户管理相关接口'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: '请输入 accessToken，请求头格式为 Bearer <token>'
      }
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          code: {
            type: 'integer',
            example: 1
          },
          data: {
            nullable: true,
            example: null
          },
          msg: {
            type: 'string',
            example: '账号不存在'
          }
        }
      },
      LoginFailureData: {
        type: 'object',
        properties: {
          loginFailCount: {
            type: 'integer',
            example: 3
          },
          isLocked: {
            type: 'boolean',
            example: false
          }
        }
      },
      LoginFailureResponse: {
        type: 'object',
        properties: {
          code: {
            type: 'integer',
            example: 1
          },
          data: {
            $ref: '#/components/schemas/LoginFailureData'
          },
          msg: {
            type: 'string',
            example: '密码错误'
          }
        }
      },
      RegisterRequest: {
        type: 'object',
        required: ['account', 'password'],
        properties: {
          account: {
            type: 'string',
            example: 'zhangsan'
          },
          password: {
            type: 'string',
            example: '123456'
          },
          nickName: {
            type: 'string',
            example: '张三'
          },
          realName: {
            type: 'string',
            example: '张三'
          },
          phone: {
            type: 'string',
            example: '13800000000'
          },
          email: {
            type: 'string',
            example: 'zhangsan@example.com'
          }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['account', 'password'],
        properties: {
          account: {
            type: 'string',
            example: 'zhangsan'
          },
          password: {
            type: 'string',
            example: '123456'
          }
        }
      },
      UserProfile: {
        type: 'object',
        properties: {
          profileId: {
            type: 'integer',
            nullable: true,
            example: 1
          },
          nickName: {
            type: 'string',
            nullable: true,
            example: '张三'
          },
          realName: {
            type: 'string',
            nullable: true,
            example: '张三'
          },
          avatarUrl: {
            type: 'string',
            nullable: true,
            example: null
          },
          phone: {
            type: 'string',
            nullable: true,
            example: '13800000000'
          },
          email: {
            type: 'string',
            nullable: true,
            example: 'zhangsan@example.com'
          },
          gender: {
            type: 'integer',
            nullable: true,
            example: null
          },
          birthday: {
            type: 'string',
            nullable: true,
            format: 'date',
            example: null
          },
          address: {
            type: 'string',
            nullable: true,
            example: null
          },
          bio: {
            type: 'string',
            nullable: true,
            example: null
          }
        }
      },
      RegisterUser: {
        type: 'object',
        properties: {
          userId: {
            type: 'integer',
            example: 1
          },
          account: {
            type: 'string',
            example: 'zhangsan'
          },
          roles: {
            type: 'array',
            items: {
              type: 'string'
            },
            example: ['user']
          }
        }
      },
      LoginUser: {
        type: 'object',
        properties: {
          userId: {
            type: 'integer',
            example: 1
          },
          account: {
            type: 'string',
            example: 'zhangsan'
          },
          status: {
            type: 'integer',
            example: 1
          },
          loginFailCount: {
            type: 'integer',
            example: 0
          },
          lastLoginAt: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            example: '2026-04-17T10:00:00.000Z'
          },
          lastLoginIp: {
            type: 'string',
            nullable: true,
            example: '127.0.0.1'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            example: '2026-04-17T09:00:00.000Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            example: '2026-04-17T10:00:00.000Z'
          },
          profile: {
            $ref: '#/components/schemas/UserProfile'
          },
          roles: {
            type: 'array',
            items: {
              type: 'string'
            },
            example: ['user', 'admin']
          },
          permissions: {
            type: 'array',
            items: {
              type: 'string'
            },
            example: ['user:read', 'user:create']
          }
        }
      },
      CurrentUser: {
        type: 'object',
        properties: {
          userId: {
            type: 'integer',
            example: 1
          },
          account: {
            type: 'string',
            example: 'zhangsan'
          },
          status: {
            type: 'integer',
            example: 1
          },
          loginFailCount: {
            type: 'integer',
            example: 0
          },
          lastLoginAt: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            example: '2026-04-17T10:00:00.000Z'
          },
          lastLoginIp: {
            type: 'string',
            nullable: true,
            example: '127.0.0.1'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            example: '2026-04-17T09:00:00.000Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            example: '2026-04-17T10:00:00.000Z'
          },
          profile: {
            $ref: '#/components/schemas/UserProfile'
          },
          roles: {
            type: 'array',
            items: {
              type: 'string'
            },
            example: ['user']
          }
        }
      },
      RoleItem: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1
          },
          role_code: {
            type: 'string',
            example: 'admin'
          },
          role_name: {
            type: 'string',
            example: 'Admin'
          },
          description: {
            type: 'string',
            nullable: true,
            example: '系统管理员'
          }
        }
      },
      PermissionItem: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1
          },
          permission_code: {
            type: 'string',
            example: 'user:read'
          },
          permission_name: {
            type: 'string',
            example: '查看用户'
          },
          description: {
            type: 'string',
            nullable: true,
            example: '允许查看用户记录'
          }
        }
      },
      RegisterResponse: {
        type: 'object',
        properties: {
          code: {
            type: 'integer',
            example: 0
          },
          data: {
            type: 'object',
            properties: {
              accessToken: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
              },
              user: {
                $ref: '#/components/schemas/RegisterUser'
              }
            }
          },
          msg: {
            type: 'string',
            example: '注册成功'
          }
        }
      },
      LoginResponse: {
        type: 'object',
        properties: {
          code: {
            type: 'integer',
            example: 0
          },
          data: {
            type: 'object',
            properties: {
              accessToken: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
              },
              user: {
                $ref: '#/components/schemas/LoginUser'
              }
            }
          },
          msg: {
            type: 'string',
            example: '登录成功'
          }
        }
      },
      UserInfoResponse: {
        type: 'object',
        properties: {
          code: {
            type: 'integer',
            example: 0
          },
          data: {
            $ref: '#/components/schemas/CurrentUser'
          },
          msg: {
            type: 'string',
            example: '获取当前用户成功'
          }
        }
      },
      RolesResponse: {
        type: 'object',
        properties: {
          code: {
            type: 'integer',
            example: 0
          },
          data: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/RoleItem'
            }
          },
          msg: {
            type: 'string',
            example: '获取当前用户角色列表成功'
          }
        }
      },
      PermissionsResponse: {
        type: 'object',
        properties: {
          code: {
            type: 'integer',
            example: 0
          },
          data: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/PermissionItem'
            }
          },
          msg: {
            type: 'string',
            example: '获取当前用户权限列表成功'
          }
        }
      },
      DatabaseTestItem: {
        type: 'object',
        properties: {
          ok: {
            type: 'integer',
            example: 1
          }
        }
      },
      DatabaseTestResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: '数据库连接成功'
          },
          data: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/DatabaseTestItem'
            }
          }
        }
      },
      UserListItem: {
        type: 'object',
        properties: {
          userId: {
            type: 'integer',
            example: 1
          },
          account: {
            type: 'string',
            example: 'zhangsan'
          },
          status: {
            type: 'integer',
            example: 1
          },
          isDeleted: {
            type: 'integer',
            example: 0
          },
          loginFailCount: {
            type: 'integer',
            example: 0
          },
          lastLoginAt: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            example: '2026-04-17T10:00:00.000Z'
          },
          lastLoginIp: {
            type: 'string',
            nullable: true,
            example: '127.0.0.1'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            example: '2026-04-17T09:00:00.000Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            example: '2026-04-17T10:00:00.000Z'
          }
        }
      },
      UsersResponse: {
        type: 'object',
        properties: {
          code: {
            type: 'integer',
            example: 0
          },
          data: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/UserListItem'
            }
          },
          msg: {
            type: 'string',
            example: '获取用户列表成功'
          }
        }
      },
      DeleteUserResponse: {
        type: 'object',
        properties: {
          code: {
            type: 'integer',
            example: 0
          },
          data: {
            type: 'object',
            properties: {
              account: {
                type: 'string',
                example: 'zhangsan'
              }
            }
          },
          msg: {
            type: 'string',
            example: '删除用户成功'
          }
        }
      }
    }
  }
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: [path.resolve(__dirname, '../routes/*.js')]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const swaggerUiOptions = {
  explorer: true,
  customSiteTitle: 'my-first-pro 接口文档',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true
  }
};

export { swaggerUi, swaggerSpec, swaggerUiOptions };
