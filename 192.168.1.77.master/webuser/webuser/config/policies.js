/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions (`true` allows public     *
  * access)                                                                  *
  *                                                                          *
  ***************************************************************************/
  //  '*': 'flash',
  'AllcodeController': {
    'getlist': true // We dont need authorization here, allowing public access
  },
  '*': 'sessionAuth',
  // '*': ['isAuthorized'], // Everything resctricted here
  'NavController': {
    'getCompanyContact': true // We dont need authorization here, allowing public access
  },
  'AccountController': 'custAuth',
  // 'AccountController': {
  //   'gettradingdate': true,
  //   'activeOPT': true,
  //   'getCfmastInfo': true,
  //   'checkGeneralInfoFatca': true,
  //   'checkGeneralInfoContact': true,
  //   'checkGeneralInfoAuth': true,
  //   'finishGeneralInfo': true,
  //   'checkGeneralInfoMain': true,
  //   'checkOldAccount': true,
  //   'getCareby4Tlid': true,
  //   'getIdType': true,
  //   'get_account_openotp': true,
  //   'getBankBranch': true,
  // },
  'FundController': {
    'get_rptfile_bycustodycd': true
  },
  'AccountInfo': {
    'forgot_usernamepassword': true,
  },
  'AuthController': {
    '*': true // We dont need authorization here, allowing public access
  },
  'NotifyController': {
    '*': true // We dont need authorization here, allowing public access
  },
  'MobileController': {
    '*': true
  },
  'OTPController': {
    'getTimeOTP': true,
    'getUpsertAccOTP': true,
    'checkUpsertAccOTP': true,
  },


  /***************************************************************************
 *                                                                          *
 * Here's an example of mapping some policies to run before a controller    *
 * and its actions                                                          *
 *                                                                          *
 ***************************************************************************/
  // RabbitController: {

  // Apply the `false` policy as the default for all of RabbitController's actions
  // (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
  // '*': false,

  // For the action `nurture`, apply the 'isRabbitMother' policy
  // (this overrides `false` above)
  // nurture	: 'isRabbitMother',

  // Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
  // before letting any users feed our rabbits
  // feed : ['isNiceToAnimals', 'hasRabbitFood']
  // }
};
