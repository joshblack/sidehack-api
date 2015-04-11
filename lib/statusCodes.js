/**
 * This file contains the definitions of various status codes used in
 * this application
 * @type {Number}
 */

// Success
export const ok                     = 200;
export const created                = 201;
export const accepted               = 202;

// Redirection
export const multiple_choices       = 300;
export const moved_permanently      = 301;
export const found                  = 302;

// Client Error
export const bad_request            = 400;
export const unauthorized           = 401;
export const forbidden              = 403;
export const not_found              = 404;

// Server Error
export const internal_server_error  = 500;
export const not_implemented        = 501;
