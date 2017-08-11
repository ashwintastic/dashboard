import React from 'react';
import App from '../components/App';
import AppContainer from '../containers/App';
import HomePage from '../pages/home';
import AccountsPage from '../pages/accounts';
import FlowPage from '../pages/flow';
import CreateEditFlowPage from '../pages/createEditFlow';
import UploadFlowPage from '../pages/uploadFlow';
import TestlinksPage from '../pages/testLinks';
import FacebookUserPage from '../pages/subscribe_pages';
import PublishBotPage from '../pages/publish_bot';
import VisualizationPage from '../pages/visualization';
import ErrorPage from '../pages/error';
import ManageAccountPage from '../pages/manage_account';
import Broadcast from '../pages/broadcast';
import CreateBroadcast from '../pages/create_broadcast';
import PollsList from '../pages/pollsList';
import Poll from '../pages/poll';
import Subscription from '../pages/subscription';
import AnalyticsPage from '../pages/analytics';
import { AnalyticsPageV1, MessagesAnalyticsPage, SessionAnalyticsPage,
        EngagementAnalyticsPage, UserAnalyticsPage, UserChangeAnalyticsPage,
        RetentionAnalyticsPage, GenderAnalyticsPage, CountryAnalyticsPage,
        TimeZoneAnalyticsPage, LanguageAnalyticsPage, SentMessagesAnalyticsPage,
        SubscriptionsChangeAnalyticsPage, DeliveryTimeAnalyticsPage, ReadTimeAnalyticsPage,
        EngagementTimeAnalyticsPage, TopNodesAnalyticsPage, TopActionsAnalyticsPage,
        TopTextInputsAnalyticsPage, TopContentItemsAnalyticsPage,
        OverviewAnalyticsPage, ReferralsAnalyticsPage, NodeAnalysisAnalyticsPage } from '../pages/analytics_v1';
import UserPage from '../pages/user';
import DashboardUserPage from '../pages/create_user'
import AccountUsersListPage from '../pages/account_users'
import AccountCreationPage from '../pages/create_account'
import UserSettingsPage from '../pages/user_settings'
import ForgotPasswordPage from '../pages/forgot_password'
import ResetPasswordPage from '../pages/reset_password'
import { redirect } from './../actions/route';
import {
  breadcrumbsReset, breadcrumbAppend
} from './../actions/breadcrumbs';
import apiData from '../utils/apiData';


export function getSessionState(dispatch) {
  return (dispatch) => {
    apiData({
      api: `/sessionstatus`,
      method: 'get'
    }, dispatch).then(resp => {
      if (resp.status === 200) {
        resp.text().then(r => {
          if (r === "true") {
            if (window.location.pathname !== "/") {
              dispatch(redirect("/?sessionexpired=true"));
            }
          } else {
            if (window.location.pathname === "/") {
              dispatch(redirect("/accounts"));
            }
          }
        }
        )
      }
    });
  };
}

const breadCrumbLabelsMap = {
  "FLOWS": "Flows"
}

export default {
  path: '/',
  async action({ next, render, context, theme }) {

    if (typeof (window) !== 'undefined') {
      // context.store.dispatch(getSessionState(context.store.dispatch));
    }

    //     const currentRoute = location.pathname;
    //     if (currentRoute !== '/') {
    //       const authState = context.store.getState().auth;
    //       console.log('currentRoute%%%%%%%%%%%%%%%%%%%%%%%%%', authState);
    //       if (authState.user.email == null) {
    //         console.log('redirecting');
    //         //context.store.dispatch(redirect('/'));
    //         return;
    //       }
    // }

    context.store.dispatch(breadcrumbsReset());
    const component = await next();
    if (component === undefined) return component;

    return render(
      <App context={context} theme={theme}>
        <AppContainer>
          {component}
        </AppContainer>
      </App>
    );


    // if (currentRoute !== '/') {
    //   console.log('path not /');
    //   const authState = context.store.getState().auth;
    //   console.log(authState);

    //   if (!authState.email) {
    //     console.log('redirecting');
    //     context.store.dispatch(redirect('/'));
    //     return null;
    //   }
    // }
  },
  children: [
    {
      path: '/',
      action: (...args) => {
        const {context} = args[0];
        return HomePage(...args);
      }
    },
    {
      path: '/login/forgot',
      action: (...args) => {
        const {context} = args[0];
        return ForgotPasswordPage(...args);
      }
    },
    {
      path: '/user/reset-password',
      action: (...args) => {
        const {context} = args[0];
        return ResetPasswordPage(...args);
      }
    },
    {
      path: '/user',
      action: async ({ next, context, baseUrl }) => {
        context.store.dispatch(breadcrumbAppend(
          'User', `${baseUrl}/user`
        ));
        return await next()
      },
      children: [
        {
          path: '/',
          action: UserPage,
        },
        {
          path: '/bots',
          action: (...args) => {
            const { context, baseUrl } = args[0];
            context.store.dispatch(breadcrumbAppend(
              'Manage', `${baseUrl}/bots`
            ));
            return ManageAccountPage(...args);
          },
        },
      ],
    },
    /*{
      path: '/flow',
      action: async ({ next, context, baseUrl }) => {
        return await next()
      },
      children: [
        {
          path: '/account/:accountId/bot/:botId/:flowId?',
          action: (...args) => {
            const { context, params, baseUrl } = args[0];
            //context.store.dispatch(breadcrumbAppend(
             // 'Flow Page', `${baseUrl}/account/${params.accountId}/bot/${params.botId}/${params.flowId || ''}`
            //));
            setBreadCrumb({ context, params, baseUrl }, ["account", "bot", "flow"]);
            return FlowPage(...args);
          },
        },
        {
          path: '/:flowId/bot/:botId/testlinks/',
          action: (...args) => {
            const { context, params, baseUrl } = args[0];
            //context.store.dispatch(breadcrumbAppend(
            //  'Test Page', `${baseUrl}/${params.flowId}/bot/${params.botId}/testlinks`
            //));
            setBreadCrumb({ context, params, baseUrl }, ["account", "bot", "flow", "testlinks"]);
            return TestlinksPage(...args);
          },
        }
      ],
    },*/



    {
      path: '/accounts',
      action: async ({ next, context, baseUrl }) => {
        context.store.dispatch(breadcrumbAppend(
          'Accounts', `${baseUrl}/accounts`
        ));
        return await next()
      },
      children: [
        {
          path: '/',
          action: AccountsPage,
        },
        {
          path: '/settings',
          action: (...args) => {
            const { context, params, baseUrl } = args[0];
            context.store.dispatch(breadcrumbAppend(
              'User Settings', ''
            ));
            return UserSettingsPage(...args);
          }
        },
        /* Accounts Page Links */
        {
          path: '/:accountId/analytics',
          action: (...args) => {
            const { context, params, baseUrl } = args[0];
            context.store.dispatch(breadcrumbAppend(
              'Bot Analytics', ''
            ));
            return AnalyticsPage(...args);
          }
        },
        {
          path: '/:accountId/userlist',
          action: (...args) => {
            const { context, params, baseUrl } = args[0];
            context.store.dispatch(breadcrumbAppend(
              'Account Users', ''
            ));
            return AccountUsersListPage(...args);
          },
        },
        {
          path: '/:accountId/createAccountUser',
          action: (...args) => {
            const { context, params, baseUrl } = args[0];
            context.store.dispatch(breadcrumbAppend(
              'Create Account User', ''
            ));
            return DashboardUserPage(...args);
          },
        },
        {
          path: '/:accountId/edituser/:userId',
          action: (...args) => {
            const { context, params, baseUrl } = args[0];
            context.store.dispatch(breadcrumbAppend(
              'Edit Account User', ''
            ));
            return DashboardUserPage(...args);
          }
        },
        {
          path: '/:accountId/bots',
          action: (...args) => {
            const { context, params, baseUrl } = args[0];
            context.store.dispatch(breadcrumbAppend(
              'Bots', ''
            ));
            return ManageAccountPage(...args);
          },
        },
        {
          path: '/:accountId/bots/:botId/analytics',
          action: (...args) => {
            const { context, params, baseUrl } = args[0];
            context.store.dispatch(breadcrumbAppend(
              'Bots', `${baseUrl}/${params.accountId}/bots`
            ));
            context.store.dispatch(breadcrumbAppend(
              'Bot Analytics', ''
            ));
            return AnalyticsPage(...args);
          }
        },
        {
          path: '/:accountId/bots/:botId/userlist',
          action: (...args) => {
            const { context, params, baseUrl } = args[0];
            context.store.dispatch(breadcrumbAppend(
              'Bots', `${baseUrl}/${params.accountId}/bots`
            ));
            context.store.dispatch(breadcrumbAppend(
              'Bot Users', ''
            ));
            return AccountUsersListPage(...args);
          },
        },
        {
          path: '/:accountId/bots/:botId/createBotUser',
          action: (...args) => {
            const { context, params, baseUrl } = args[0];
            context.store.dispatch(breadcrumbAppend(
              'Bots', `${baseUrl}/${params.accountId}/bots`
            ));
            context.store.dispatch(breadcrumbAppend(
              'Create Bot User', ''
            ));
            return DashboardUserPage(...args);
          },
        },

        {
          path: '/:accountId/bots/:botId/edituser/:userId',
          action: (...args) => {
            const { context, params, baseUrl } = args[0];
            context.store.dispatch(breadcrumbAppend(
              'Bots', `${baseUrl}/${params.accountId}/bots`
            ));
            context.store.dispatch(breadcrumbAppend(
              'Edit Bot User', ''
            ));
            return DashboardUserPage(...args);
          },
        },
        {
          path: '/:accountId/bots/:botId/broadcast',
          action: (...args) => {
            const { context, params, baseUrl } = args[0];
            context.store.dispatch(breadcrumbAppend(
              'Bots', `${baseUrl}/${params.accountId}/bots`
            ));
            context.store.dispatch(breadcrumbAppend(
              'Broadcast Entries', ''
            ));
            return Broadcast(...args);
          }
        },
        {
          path: '/:accountId/bots/:botId/broadcast/upsert/:broadcastId?',
          action: (...args) => {
            const { context, params, baseUrl } = args[0];
            context.store.dispatch(breadcrumbAppend(
              'Bots', `${baseUrl}/${params.accountId}/bots`
            ));
            context.store.dispatch(breadcrumbAppend(
              'Broadcast Entries', `${baseUrl}/${params.accountId}/bots/${params.botId}/broadcast`
            ));
            context.store.dispatch(breadcrumbAppend(
              'Broadcast', ''
            ));
            return CreateBroadcast(...args);
          }
        },
        {
          path: '/:accountId/bots/:botId/broadcast/:broadcastId/polls/:pollId',
          action: (...args) => {
            const { context, params, baseUrl } = args[0];
            context.store.dispatch(breadcrumbAppend(
              'Bots', `${baseUrl}/${params.accountId}/bots`
            ));
            context.store.dispatch(breadcrumbAppend(
              'Broadcast Entries', `${baseUrl}/${params.accountId}/bots/${params.botId}/broadcast`
            ));
            context.store.dispatch(breadcrumbAppend(
              'Poll Broadcast', ''
            ));
            return CreateBroadcast(...args);
          }
        },
        {
          path: '/:accountId/bots/:botId/polls',
          action: (...args) => {
            const { context, params, baseUrl } = args[0];
            context.store.dispatch(breadcrumbAppend(
              'Bots', `${baseUrl}/${params.accountId}/bots`
            ));
            context.store.dispatch(breadcrumbAppend(
              'Polls', ''
            ));
            return PollsList(...args);
          }
        },
        {
          path: '/:accountId/bots/:botId/polls/:pollId/broadcast',
          action: (...args) => {
            const { context, params, baseUrl } = args[0];
            context.store.dispatch(breadcrumbAppend(
              'Bots', `${baseUrl}/${params.accountId}/bots`
            ));
            context.store.dispatch(breadcrumbAppend(
              'Polls', `${baseUrl}/${params.accountId}/bots/${params.botId}/polls`
            ));
            context.store.dispatch(breadcrumbAppend(
              'Poll Broadcast', ''
            ));
            return CreateBroadcast(...args);
          }
        },
        {
          path: '/:accountId/bots/:botId/polls/create',
          action: (...args) => {
            const { context, params, baseUrl } = args[0];
            context.store.dispatch(breadcrumbAppend(
              'Bots', `${baseUrl}/${params.accountId}/bots`
            ));
            context.store.dispatch(breadcrumbAppend(
              'Polls', `${baseUrl}/${params.accountId}/bots/${params.botId}/polls`
            ));
            context.store.dispatch(breadcrumbAppend(
              'Create Poll', ''
            ));
            return Poll(...args);
          }
        },
        {
          path: '/:accountId/bots/:botId/polls/:pollId',
          action: (...args) => {
            const { context, params, baseUrl } = args[0];
            context.store.dispatch(breadcrumbAppend(
              'Bots', `${baseUrl}/${params.accountId}/bots`
            ));
            context.store.dispatch(breadcrumbAppend(
              'Polls', `${baseUrl}/${params.accountId}/bots/${params.botId}/polls`
            ));
            context.store.dispatch(breadcrumbAppend(
              'Edit', ''
            ));
            return Poll(...args);
          }
        },
        {
          path: '/:accountId/bots/:botId/flows',
          action: (...args) => {
            const { context, params, baseUrl } = args[0];
            context.store.dispatch(breadcrumbAppend(
              'Bots', `${baseUrl}/${params.accountId}/bots`
            ));
            context.store.dispatch(breadcrumbAppend(
              breadCrumbLabelsMap.FLOWS, ''
            ));
            return FlowPage(...args);
          },
        },
        {
          path: '/:accountId/bots/:botId/flows/create',
          action: (...args) => {
            const { context, params, baseUrl } = args[0];
            context.store.dispatch(breadcrumbAppend(
              'Bots', `${baseUrl}/${params.accountId}/bots`
            ));
            context.store.dispatch(breadcrumbAppend(
              breadCrumbLabelsMap.FLOWS, `${baseUrl}/${params.accountId}/bots/${params.botId}/flows`
            ));
            context.store.dispatch(breadcrumbAppend(
              'Create Flow', ''
            ));
            return CreateEditFlowPage(...args);
          },
        },
        {
          path: '/:accountId/bots/:botId/flows/:flowId/edit',
          action: (...args) => {
            const { context, params, baseUrl } = args[0];
            context.store.dispatch(breadcrumbAppend(
              'Bots', `${baseUrl}/${params.accountId}/bots`
            ));
            context.store.dispatch(breadcrumbAppend(
              breadCrumbLabelsMap.FLOWS, `${baseUrl}/${params.accountId}/bots/${params.botId}/flows`
            ));
            context.store.dispatch(breadcrumbAppend(
              'Edit Flow', ''
            ));
            return CreateEditFlowPage(...args);
          },
        },
        {
          path: '/:accountId/bots/:botId/flows/:flowId/upload',
          action: (...args) => {
            const { context, params, baseUrl } = args[0];
            context.store.dispatch(breadcrumbAppend(
              'Bots', `${baseUrl}/${params.accountId}/bots`
            ));

            return UploadFlowPage(...args);
          },
        },
        {
          path: '/:accountId/bots/:botId/flows/:flowId/testlinks',
          action: (...args) => {
            const { context, params, baseUrl } = args[0];
            context.store.dispatch(breadcrumbAppend(
              'Bots', `${baseUrl}/${params.accountId}/bots`
            ));
            context.store.dispatch(breadcrumbAppend(
              breadCrumbLabelsMap.FLOWS, `${baseUrl}/${params.accountId}/bots/${params.botId}/flows`
            ));
            context.store.dispatch(breadcrumbAppend(
              'Test Page', ``
            ));
            return TestlinksPage(...args);
          },
        },
        {
          path: '/:accountId/bots/:botId/flows/:flowId/visualization/',
          action: (...args) => {
            const { context, params, baseUrl } = args[0];
            context.store.dispatch(breadcrumbAppend(
              'Bots', `${baseUrl}/${params.accountId}/bots`
            ));
            context.store.dispatch(breadcrumbAppend(
              breadCrumbLabelsMap.FLOWS, `${baseUrl}/${params.accountId}/bots/${params.botId}/flows`
            ));
            context.store.dispatch(breadcrumbAppend(
              'Flow Visualization', ``
            ));
            return VisualizationPage(...args);
          }
        },
        {
          path: '/:accountId/bots/:botId/user/:userId/platform',
          action: (...args) => {
            const { context, params, baseUrl } = args[0];
            context.store.dispatch(breadcrumbAppend(
              'Bots', `${baseUrl}/${params.accountId}/bots`
            ));
            context.store.dispatch(breadcrumbAppend(
              'Bot Publish', ''
            ));
            return PublishBotPage(...args);
          },
        },
        {
          path: '/:accountId/bots/:botId/subscriptions',
          action: (...args) => {
            const { context, params, baseUrl } = args[0];
            context.store.dispatch(breadcrumbAppend(
              'Bots', `${baseUrl}/${params.accountId}/bots`
            ));
            context.store.dispatch(breadcrumbAppend(
              'Subscriptions', ''
            ));
            return Subscription(...args);
          }
        },
        {
          path: '/:accountId/edit',
          action: (...args) => {
            const { context, params, baseUrl } = args[0];
            context.store.dispatch(breadcrumbAppend(
              'Edit Account', ''
            ));
            return AccountCreationPage(...args);
          },
        },
        /* Accounts Page Links -------------- END */
        {
          path: '/flowlist',
          action: (...args) => {
            const { context, baseUrl } = args[0];
            context.store.dispatch(breadcrumbAppend(
              'Manage', `${baseUrl}/manage`
            ));
            return ManageAccountPage(...args);
          },
        },
        {
          path: '/:accountId/bots/:botId/user/:userId/pagelist',
          action: (...args) => {
            const { context, params, baseUrl } = args[0];
            context.store.dispatch(breadcrumbAppend(
              'Bots', `${baseUrl}/${params.accountId}/bots`
            ));
            context.store.dispatch(breadcrumbAppend(
              'Facebook', ''
            ));
            return FacebookUserPage(...args);
          },
        },


        {
          path: '/createAccount',
          action: (...args) => {
            const { context, params, baseUrl } = args[0];
            context.store.dispatch(breadcrumbAppend(
              'Create New Account', `${baseUrl}/createAccount`
            ));
            return AccountCreationPage(...args);
          },
        },


      ],
    },

        {
            path: '/analytics/v1',
        //   action: (...args) => {
        //     const { context, params, baseUrl } = args[0];
        //     context.store.dispatch(breadcrumbAppend(
        //       'Bot Analytics', ''
        //     ));
        //     return await next()
        //   },
            action: async ({ next, context, baseUrl }) => {
                context.store.dispatch(breadcrumbAppend(
                'Bot Analytics', ''
                ));
            return await next()
        },
          children: [
              {
                path: '/',
                action: (...args) => {
                    const { context, params, baseUrl } = args[0];
                    return AnalyticsPageV1(...args);
                },
            },
            {
                path: '/overview',
                action: (...args) => {
                    const { context, params, baseUrl } = args[0];
                    return OverviewAnalyticsPage(...args);
                }
            },
            {
                path: '/messages',
                action: (...args) => {
                    const { context, params, baseUrl } = args[0];
                    return MessagesAnalyticsPage(...args);
                }
            },
            {
                path: '/sessions',
                action: (...args) => {
                    const { context, params, baseUrl } = args[0];
                    return SessionAnalyticsPage(...args);
                }
            },
            {
                path: '/engagement',
                action: (...args) => {
                    const { context, params, baseUrl } = args[0];
                    return EngagementAnalyticsPage(...args);
                }
            },
            {
                path: '/users',
                action: (...args) => {
                    const { context, params, baseUrl } = args[0];
                    return UserAnalyticsPage(...args);
                }
            },
            {
                path: '/userChange',
                action: (...args) => {
                    const { context, params, baseUrl } = args[0];
                    return UserChangeAnalyticsPage(...args);
                }
            },
            {
                path: '/retention',
                action: (...args) => {
                    const { context, params, baseUrl } = args[0];
                    return RetentionAnalyticsPage(...args);
                }
            },
            {
                path: '/gender',
                action: (...args) => {
                    const { context, params, baseUrl } = args[0];
                    return GenderAnalyticsPage(...args);
                }
            },
            {
                path: '/country',
                action: (...args) => {
                    const { context, params, baseUrl } = args[0];
                    return CountryAnalyticsPage(...args);
                }
            },
            {
                path: '/timezone',
                action: (...args) => {
                    const { context, params, baseUrl } = args[0];
                    return TimeZoneAnalyticsPage(...args);
                }
            },
            {
                path: '/locale',
                action: (...args) => {
                    const { context, params, baseUrl } = args[0];
                    return LanguageAnalyticsPage(...args);
                }
            },
            {
                path: '/sentMessages',
                action: (...args) => {
                    return SentMessagesAnalyticsPage(...args);
                }
            },
            {
                path: '/subscriptionChange',
                action: (...args) => {
                    return SubscriptionsChangeAnalyticsPage(...args);
                }
            },
            {
                path: '/deliveryTime',
                action: (...args) => {
                    return DeliveryTimeAnalyticsPage(...args);
                }
            },
            {
                path: '/readTime',
                action: (...args) => {
                    return ReadTimeAnalyticsPage(...args);
                }
            },
            {
                path: '/engagementTime',
                action: (...args) => {
                    return EngagementTimeAnalyticsPage(...args);
                }
            },
            {
                path: '/topNodes',
                action: (...args) => {
                    return TopNodesAnalyticsPage(...args);
                }
            },
            {
                path: '/topActions',
                action: (...args) => {
                    return TopActionsAnalyticsPage(...args);
                }
            },
            {
                path: '/topTextInputs',
                action: (...args) => {
                    return TopTextInputsAnalyticsPage(...args);
                }
            },
            {
                path: '/topContentItems',
                action: (...args) => {
                    return TopContentItemsAnalyticsPage(...args);
                }
            },
            {
                path: '/nodeAnalysis',
                action: (...args) => {
                    return NodeAnalysisAnalyticsPage(...args);
                }
            },
            {
                path: '/referrals',
                action: (...args) => {
                    return ReferralsAnalyticsPage(...args);
                }
            }
          ]
        },


    {
      path: '/error',
      action({ render, context, error }) {
        return render(
          <App context={context} error={error}>
            <ErrorPage error={error} />
          </App>,
          error.status || 500
        );
      },
    },
  ],
};
