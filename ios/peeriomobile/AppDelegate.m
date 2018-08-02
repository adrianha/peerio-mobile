/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTPushNotificationManager.h>
#import <AddressBook/AddressBook.h>
#import <UserNotifications/UserNotifications.h>
#import <Contacts/Contacts.h>

CNContactStore* contactStore = nil;

@implementation AppDelegate

/* ABAddressBookRef _addressBook;

void RogerAddressBookChangeCallback(ABAddressBookRef addressBook, CFDictionaryRef info, void *context) {
    NSLog(@"Address book change");
    CFArrayRef peopleRefs = ABAddressBookCopyArrayOfAllPeopleInSource(addressBook, kABSourceTypeLocal);
    long count = CFArrayGetCount(peopleRefs);
    NSLog(@"Count: %ld", count);
    for (long i = 0; i < count; i++) {
        ABRecordRef ref = CFArrayGetValueAtIndex(peopleRefs, i);
        NSDate* datemod = (__bridge_transfer NSDate *)(ABRecordCopyValue(ref, kABPersonModificationDateProperty));


        NSTimeInterval distanceBetweenDates = [[NSDate date] timeIntervalSinceDate:datemod];

        int seconds = round(distanceBetweenDates);

        if(seconds < 60) {
            // NSLog(@"modifactiondate: %@", datemod);
        }
    }


    NSLog(@"Yes it does get called by this change %@", context);

    // ABAddressBookRevert(addressBook);
    // RogerAddressBook *instance = (__bridge RogerAddressBook *)context;
    // [instance import];
} */

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"peeriomobile"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  UIStoryboard *sb = [UIStoryboard storyboardWithName:@"Launch Screen" bundle:nil];
  UIViewController *launchViewController = [sb instantiateViewControllerWithIdentifier:@"launchController"];
  UIView *launchView = [launchViewController view];
  [rootView setLoadingView:launchView];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  // Set up address book API.
  /* CFErrorRef *error = NULL;
  _addressBook = ABAddressBookCreateWithOptions(NULL, error);
  if (error) {
      NSLog(@"Could not initialize address book: %@", CFBridgingRelease(CFErrorCopyFailureReason(*error)));
  } else {
      ABAddressBookRegisterExternalChangeCallback(_addressBook, RogerAddressBookChangeCallback, (__bridge void *)self);
      NSLog(@"Registered callback");
  } */
  /* contactStore = [[CNContactStore alloc] init];
  [[NSNotificationCenter defaultCenter] addObserver:self
                                  selector:@selector(userContactsChange:)
             name:CNContactStoreDidChangeNotification object:nil]; */

  return YES;
}

// Required to register for notifications
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
  [RCTPushNotificationManager didRegisterUserNotificationSettings:notificationSettings];
}
// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RCTPushNotificationManager didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  [RCTPushNotificationManager didFailToRegisterForRemoteNotificationsWithError:error];
}
// Required for the localNotification event.
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
  [RCTPushNotificationManager didReceiveLocalNotification:notification];
}
@end
