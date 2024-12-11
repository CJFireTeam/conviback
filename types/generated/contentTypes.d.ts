import type { Schema, Attribute } from '@strapi/strapi';

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    username: Attribute.String;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    registrationToken: Attribute.String & Attribute.Private;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    preferedLanguage: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    name: 'API Token Permission';
    description: '';
    singularName: 'api-token-permission';
    pluralName: 'api-token-permissions';
    displayName: 'API Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    name: 'Transfer Token';
    singularName: 'transfer-token';
    pluralName: 'transfer-tokens';
    displayName: 'Transfer Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    name: 'Transfer Token Permission';
    description: '';
    singularName: 'transfer-token-permission';
    pluralName: 'transfer-token-permissions';
    displayName: 'Transfer Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    alternativeText: Attribute.String;
    caption: Attribute.String;
    width: Attribute.Integer;
    height: Attribute.Integer;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    ext: Attribute.String;
    mime: Attribute.String & Attribute.Required;
    size: Attribute.Decimal & Attribute.Required;
    url: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesRelease extends Schema.CollectionType {
  collectionName: 'strapi_releases';
  info: {
    singularName: 'release';
    pluralName: 'releases';
    displayName: 'Release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    releasedAt: Attribute.DateTime;
    scheduledAt: Attribute.DateTime;
    timezone: Attribute.String;
    status: Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Attribute.Required;
    actions: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Schema.CollectionType {
  collectionName: 'strapi_release_actions';
  info: {
    singularName: 'release-action';
    pluralName: 'release-actions';
    displayName: 'Release Action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    type: Attribute.Enumeration<['publish', 'unpublish']> & Attribute.Required;
    entry: Attribute.Relation<
      'plugin::content-releases.release-action',
      'morphToOne'
    >;
    contentType: Attribute.String & Attribute.Required;
    locale: Attribute.String;
    release: Attribute.Relation<
      'plugin::content-releases.release-action',
      'manyToOne',
      'plugin::content-releases.release'
    >;
    isEntryValid: Attribute.Boolean;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginI18NLocale extends Schema.CollectionType {
  collectionName: 'i18n_locale';
  info: {
    singularName: 'locale';
    pluralName: 'locales';
    collectionName: 'locales';
    displayName: 'Locale';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.SetMinMax<
        {
          min: 1;
          max: 50;
        },
        number
      >;
    code: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: 'up_permissions';
  info: {
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: 'up_roles';
  info: {
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    description: Attribute.String;
    type: Attribute.String & Attribute.Unique;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    name: 'user';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    second_lastname: Attribute.String & Attribute.Required;
    first_lastname: Attribute.String & Attribute.Required;
    firstname: Attribute.String & Attribute.Required;
    secondname: Attribute.String & Attribute.Required;
    establishment: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'api::establishment.establishment'
    >;
    tipo: Attribute.Enumeration<['alumno', 'apoderado', 'otro']> &
      Attribute.DefaultTo<'otro'>;
    direccion: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 5;
      }>;
    region: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 5;
      }>;
    comuna: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 5;
      }>;
    establishment_authenticateds: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::establishment.establishment'
    >;
    phone: Attribute.String & Attribute.Required;
    meeting: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'api::meeting.meeting'
    >;
    canUploadDoc: Attribute.Boolean & Attribute.DefaultTo<false>;
    documents: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::document.document'
    >;
    documentsList: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::document.document'
    >;
    Meeting_Destiny: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'api::meeting.meeting'
    >;
    establishment_courses: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToMany',
      'api::establishment-course.establishment-course'
    >;
    establishment_course: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'api::establishment-course.establishment-course'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCaseCase extends Schema.CollectionType {
  collectionName: 'cases';
  info: {
    singularName: 'case';
    pluralName: 'cases';
    displayName: 'case';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    measures: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    story: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    directed: Attribute.Relation<
      'api::case.case',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    who: Attribute.JSON;
    establishment: Attribute.Relation<
      'api::case.case',
      'oneToOne',
      'api::establishment.establishment'
    >;
    when: Attribute.JSON;
    where: Attribute.JSON;
    created: Attribute.Relation<
      'api::case.case',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    fase: Attribute.Integer & Attribute.DefaultTo<1>;
    derived: Attribute.Boolean & Attribute.DefaultTo<false>;
    category: Attribute.Enumeration<
      [
        'Initial',
        'Aula Segura',
        'Pr\u00E1cticas abusivas sexuales',
        'Maltrato f\u00EDsico y psicol\u00F3gico entre pares',
        'Embarazo y paternidad adolescente',
        'Vulneraci\u00F3n de derechos',
        'Consumo de drogas y alcohol',
        'Tendencia o actos suicidas',
        'Bullying',
        'Otros'
      ]
    > &
      Attribute.DefaultTo<'Initial'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::case.case', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::case.case', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiChargeCharge extends Schema.CollectionType {
  collectionName: 'charges';
  info: {
    singularName: 'charge';
    pluralName: 'charges';
    displayName: 'charge';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    professional: Attribute.Relation<
      'api::charge.charge',
      'oneToOne',
      'api::professional.professional'
    >;
    case: Attribute.Relation<
      'api::charge.charge',
      'oneToOne',
      'api::case.case'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::charge.charge',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::charge.charge',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiComplaintComplaint extends Schema.CollectionType {
  collectionName: 'complaints';
  info: {
    singularName: 'complaint';
    pluralName: 'complaints';
    displayName: 'complaint';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    first_case: Attribute.Relation<
      'api::complaint.complaint',
      'oneToOne',
      'api::case.case'
    >;
    derived: Attribute.Relation<
      'api::complaint.complaint',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    nameSchoolar: Attribute.Text &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 5;
      }>;
    course: Attribute.String & Attribute.Required;
    Teacher: Attribute.Text &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 5;
      }>;
    date: Attribute.DateTime;
    details: Attribute.Text &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 10;
      }>;
    measures: Attribute.Text &
      Attribute.SetMinMaxLength<{
        minLength: 10;
      }>;
    created: Attribute.Relation<
      'api::complaint.complaint',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    options: Attribute.JSON;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::complaint.complaint',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::complaint.complaint',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDocumentDocument extends Schema.CollectionType {
  collectionName: 'documents';
  info: {
    singularName: 'document';
    pluralName: 'documents';
    displayName: 'Document';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    descriptionDoc: Attribute.Text;
    userId: Attribute.Relation<
      'api::document.document',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    establishmentId: Attribute.Relation<
      'api::document.document',
      'manyToOne',
      'api::establishment.establishment'
    >;
    document: Attribute.Media;
    Eliminado: Attribute.Boolean & Attribute.DefaultTo<false>;
    user_destiny: Attribute.Relation<
      'api::document.document',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    establishment_course: Attribute.Relation<
      'api::document.document',
      'manyToOne',
      'api::establishment-course.establishment-course'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::document.document',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::document.document',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiEstablishmentEstablishment extends Schema.CollectionType {
  collectionName: 'establishments';
  info: {
    singularName: 'establishment';
    pluralName: 'establishments';
    displayName: 'establishment';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    status: Attribute.Boolean & Attribute.DefaultTo<true>;
    address: Attribute.String;
    Phone: Attribute.String;
    Comuna: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    users: Attribute.Relation<
      'api::establishment.establishment',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    is_listing: Attribute.Boolean & Attribute.DefaultTo<false>;
    meeting: Attribute.Relation<
      'api::establishment.establishment',
      'oneToOne',
      'api::meeting.meeting'
    >;
    documents: Attribute.Relation<
      'api::establishment.establishment',
      'oneToMany',
      'api::document.document'
    >;
    establishment_courses: Attribute.Relation<
      'api::establishment.establishment',
      'oneToMany',
      'api::establishment-course.establishment-course'
    >;
    Region: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::establishment.establishment',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::establishment.establishment',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiEstablishmentCourseEstablishmentCourse
  extends Schema.CollectionType {
  collectionName: 'establishment_courses';
  info: {
    singularName: 'establishment-course';
    pluralName: 'establishment-courses';
    displayName: 'EstablishmentCourse';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    Letter: Attribute.String & Attribute.Required;
    Grade: Attribute.String & Attribute.Required;
    establishment: Attribute.Relation<
      'api::establishment-course.establishment-course',
      'manyToOne',
      'api::establishment.establishment'
    >;
    Eliminado: Attribute.Boolean & Attribute.DefaultTo<false>;
    meeting: Attribute.Relation<
      'api::establishment-course.establishment-course',
      'manyToOne',
      'api::meeting.meeting'
    >;
    users: Attribute.Relation<
      'api::establishment-course.establishment-course',
      'manyToMany',
      'plugin::users-permissions.user'
    >;
    documents: Attribute.Relation<
      'api::establishment-course.establishment-course',
      'oneToMany',
      'api::document.document'
    >;
    LeadTeacher: Attribute.Relation<
      'api::establishment-course.establishment-course',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::establishment-course.establishment-course',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::establishment-course.establishment-course',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiFormularioFormulario extends Schema.CollectionType {
  collectionName: 'formularios';
  info: {
    singularName: 'formulario';
    pluralName: 'formularios';
    displayName: 'formulario';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    Titulo: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 5;
      }>;
    FechaInicio: Attribute.Date & Attribute.Required;
    FechaFin: Attribute.Date & Attribute.Required;
    creador: Attribute.Relation<
      'api::formulario.formulario',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    Descripcion: Attribute.Text;
    status: Attribute.Boolean & Attribute.DefaultTo<true>;
    establishment: Attribute.Relation<
      'api::formulario.formulario',
      'oneToOne',
      'api::establishment.establishment'
    >;
    formulario_pregutas: Attribute.Relation<
      'api::formulario.formulario',
      'oneToMany',
      'api::pregunta.pregunta'
    >;
    ForCourse: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::formulario.formulario',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::formulario.formulario',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMeetingMeeting extends Schema.CollectionType {
  collectionName: 'meetings';
  info: {
    singularName: 'meeting';
    pluralName: 'meetings';
    displayName: 'Meeting';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    CreationDate: Attribute.Date;
    RoomName: Attribute.String;
    RoomUrl: Attribute.String;
    Establishment: Attribute.Relation<
      'api::meeting.meeting',
      'oneToOne',
      'api::establishment.establishment'
    >;
    CreatorUser: Attribute.Relation<
      'api::meeting.meeting',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    Users_destiny: Attribute.Relation<
      'api::meeting.meeting',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    establishment_courses: Attribute.Relation<
      'api::meeting.meeting',
      'oneToMany',
      'api::establishment-course.establishment-course'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::meeting.meeting',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::meeting.meeting',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPositionPosition extends Schema.CollectionType {
  collectionName: 'positions';
  info: {
    singularName: 'position';
    pluralName: 'positions';
    displayName: 'position';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    establishment: Attribute.Relation<
      'api::position.position',
      'oneToOne',
      'api::establishment.establishment'
    >;
    name: Attribute.String & Attribute.Required;
    status: Attribute.Boolean & Attribute.DefaultTo<true>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::position.position',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::position.position',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPreguntaPregunta extends Schema.CollectionType {
  collectionName: 'preguntas';
  info: {
    singularName: 'pregunta';
    pluralName: 'preguntas';
    displayName: 'pregunta';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    Titulo: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    Tipo: Attribute.Enumeration<
      ['text', 'option', 'multipleChoice', 'qualification']
    > &
      Attribute.Required;
    opciones: Attribute.JSON;
    formulario: Attribute.Relation<
      'api::pregunta.pregunta',
      'manyToOne',
      'api::formulario.formulario'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::pregunta.pregunta',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::pregunta.pregunta',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiProfessionalProfessional extends Schema.CollectionType {
  collectionName: 'professionals';
  info: {
    singularName: 'professional';
    pluralName: 'professionals';
    displayName: 'professional';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    names: Attribute.Text & Attribute.Required;
    surnames: Attribute.Text;
    position: Attribute.Relation<
      'api::professional.professional',
      'oneToOne',
      'api::position.position'
    >;
    establishment: Attribute.Relation<
      'api::professional.professional',
      'oneToOne',
      'api::establishment.establishment'
    >;
    status: Attribute.Boolean & Attribute.DefaultTo<true>;
    email: Attribute.Email & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::professional.professional',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::professional.professional',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiRoleListRoleList extends Schema.CollectionType {
  collectionName: 'role_lists';
  info: {
    singularName: 'role-list';
    pluralName: 'role-lists';
    displayName: 'roleList';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    reference: Attribute.Integer;
    forCases: Attribute.Boolean;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::role-list.role-list',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::role-list.role-list',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSugerenciaSugerencia extends Schema.CollectionType {
  collectionName: 'sugerencias';
  info: {
    singularName: 'sugerencia';
    pluralName: 'sugerencias';
    displayName: 'sugerencia';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    sugerencia: Attribute.Text &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 10;
      }>;
    creador: Attribute.Relation<
      'api::sugerencia.sugerencia',
      'oneToOne',
      'plugin::users-permissions.user'
    > &
      Attribute.Required;
    establishment: Attribute.Relation<
      'api::sugerencia.sugerencia',
      'oneToOne',
      'api::establishment.establishment'
    > &
      Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::sugerencia.sugerencia',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::sugerencia.sugerencia',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiSuggestionSuggestion extends Schema.CollectionType {
  collectionName: 'suggestions';
  info: {
    singularName: 'suggestion';
    pluralName: 'suggestions';
    displayName: 'suggestion';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    suggestion: Attribute.Text &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 10;
      }>;
    created: Attribute.Relation<
      'api::suggestion.suggestion',
      'oneToOne',
      'plugin::users-permissions.user'
    > &
      Attribute.Required;
    establishment: Attribute.Relation<
      'api::suggestion.suggestion',
      'oneToOne',
      'api::establishment.establishment'
    > &
      Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::suggestion.suggestion',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::suggestion.suggestion',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiUserQuestionFormUserQuestionForm
  extends Schema.CollectionType {
  collectionName: 'user_question_forms';
  info: {
    singularName: 'user-question-form';
    pluralName: 'user-question-forms';
    displayName: 'userQuestionForm';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    userform: Attribute.Relation<
      'api::user-question-form.user-question-form',
      'oneToOne',
      'api::userform.userform'
    >;
    pregunta: Attribute.Relation<
      'api::user-question-form.user-question-form',
      'oneToOne',
      'api::pregunta.pregunta'
    >;
    response: Attribute.JSON & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::user-question-form.user-question-form',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::user-question-form.user-question-form',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiUserformUserform extends Schema.CollectionType {
  collectionName: 'userforms';
  info: {
    singularName: 'userform';
    pluralName: 'userforms';
    displayName: 'userform';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    isCompleted: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    user: Attribute.Relation<
      'api::userform.userform',
      'oneToOne',
      'plugin::users-permissions.user'
    > &
      Attribute.Required;
    establishment: Attribute.Relation<
      'api::userform.userform',
      'oneToOne',
      'api::establishment.establishment'
    > &
      Attribute.Required;
    date: Attribute.DateTime & Attribute.Required;
    formulario: Attribute.Relation<
      'api::userform.userform',
      'oneToOne',
      'api::formulario.formulario'
    > &
      Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::userform.userform',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::userform.userform',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'api::case.case': ApiCaseCase;
      'api::charge.charge': ApiChargeCharge;
      'api::complaint.complaint': ApiComplaintComplaint;
      'api::document.document': ApiDocumentDocument;
      'api::establishment.establishment': ApiEstablishmentEstablishment;
      'api::establishment-course.establishment-course': ApiEstablishmentCourseEstablishmentCourse;
      'api::formulario.formulario': ApiFormularioFormulario;
      'api::meeting.meeting': ApiMeetingMeeting;
      'api::position.position': ApiPositionPosition;
      'api::pregunta.pregunta': ApiPreguntaPregunta;
      'api::professional.professional': ApiProfessionalProfessional;
      'api::role-list.role-list': ApiRoleListRoleList;
      'api::sugerencia.sugerencia': ApiSugerenciaSugerencia;
      'api::suggestion.suggestion': ApiSuggestionSuggestion;
      'api::user-question-form.user-question-form': ApiUserQuestionFormUserQuestionForm;
      'api::userform.userform': ApiUserformUserform;
    }
  }
}
