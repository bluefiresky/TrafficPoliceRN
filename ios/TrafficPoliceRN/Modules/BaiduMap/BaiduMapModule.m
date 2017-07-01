//
//  BaiduMapModule.m
//  TrafficPoliceRN
//
//  Created by Sky on 2017/6/21.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "BaiduMapModule.h"

@interface BaiduMapModule()
{
  CLLocationCoordinate2D *location2D;
}
@property (nonatomic,strong)RCTPromiseResolveBlock resolve;
@property (nonatomic,strong)RCTPromiseRejectBlock reject;
@property (nonatomic,strong)BMKMapManager *mapManager;
@property (nonatomic,strong)BMKLocationService* locService;
@property (nonatomic,strong)BMKGeoCodeSearch *geosearch;

@end

@implementation BaiduMapModule

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(location,
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  self.resolve = resolve;
  self.reject = reject;
  
  dispatch_async(dispatch_get_main_queue(), ^{
    // 先初始化BaiduMapManager
     self.mapManager = [[BMKMapManager alloc] init];
    
    // 默认百度坐标系是BD09（BMK_COORDTYPE_BD09LL）坐标.
    [BMKMapManager setCoordinateTypeUsedInBaiduMapSDK:BMK_COORDTYPE_BD09LL];
    
    // 启动BaiduMapManger, 配置百度地图应用AK, 授权成功后才能开始定位，授权回调在下边
    BOOL flag = [self.mapManager start:@"ouL4ZpqMYoGhpxxO8cZzOCbHtwknIpcg" generalDelegate:self];
    if(!flag){
      NSMutableDictionary *map = [[NSMutableDictionary alloc] initWithCapacity:1];
      [map setValue:@(-98) forKey:@"errorCode"];
      self.resolve(map);
    }
  });
  
}

-(void) willStartLocatingUser
{
  NSLog(@"--- 开始定位");
}

//实现相关delegate 处理位置信息更新
//处理方向变更信息
- (void)didUpdateUserHeading:(BMKUserLocation *)userLocation
{
//  NSLog(@"--- heading is %@",userLocation.heading);
}

// 位置更新后，会调用此函数
-(void) didUpdateBMKUserLocation:(BMKUserLocation *)userLocation
{
  if(location2D == nil){
    CLLocationCoordinate2D c = userLocation.location.coordinate;
    NSLog(@"--- 位置已更新 the latitude -->> %f and the logitude -->> %f", c.latitude, c.longitude);
    location2D = &c;
    BMKReverseGeoCodeOption *reverseGeocodeSearchOption = [[BMKReverseGeoCodeOption alloc]init];
    reverseGeocodeSearchOption.reverseGeoPoint = userLocation.location.coordinate;
    self.geosearch = [[BMKGeoCodeSearch alloc]init];
    self.geosearch.delegate = self;
    BOOL flag = [self.geosearch reverseGeoCode:reverseGeocodeSearchOption];
    if(!flag){
      NSMutableDictionary *map = [[NSMutableDictionary alloc] initWithCapacity:1];
      [map setValue:@(-99) forKey:@"errorCode"];
      self.resolve(map);
    }
  }
}

-(void) onGetReverseGeoCodeResult:(BMKGeoCodeSearch *)searcher result:(BMKReverseGeoCodeResult *)result errorCode:(BMKSearchErrorCode)error
{
  NSLog(@"--- 获取geo信息 the error -->> %i", error);
  NSMutableDictionary *map = [[NSMutableDictionary alloc] initWithCapacity:3];
  if (error == 0) {
//    BMKPointAnnotation* item = [[BMKPointAnnotation alloc]init];
    NSString* address = result.address;
    float latitude = result.location.latitude;
    float longitude = result.location.longitude;
    
    [map setObject:address forKey:@"address"];
    [map setValue:@(latitude) forKey:@"latitude"];
    [map setValue:@(longitude) forKey:@"longitude"];
    
    self.resolve(map);
  }else{
    [map setValue:@(error) forKey:@"errorCode"];
    self.resolve(map);
  }
}


- (void)didStopLocatingUser
{
  NSLog(@"--- 停止定位");
  NSMutableDictionary *map = [[NSMutableDictionary alloc] initWithCapacity:1];
  [map setValue:@(-100) forKey:@"errorCode"];
  self.resolve(map);
}

- (void)didFailToLocateUserWithError:(NSError *)error
{
  NSLog(@"--- 定位失败 and the error -->> %@", error);
  NSMutableDictionary *map = [[NSMutableDictionary alloc] initWithCapacity:1];
  [map setValue:@(error.code) forKey:@"errorCode"];
  self.resolve(map);
}

- (void)onGetNetworkState:(int)iError
{
  if (0 == iError) {
    NSLog(@"--- 联网成功");
  }
  else{
    NSLog(@"--- onGetNetworkState %d",iError);
  }
  
}

- (void)onGetPermissionState:(int)iError
{
  if (0 == iError) {
    NSLog(@"--- 授权成功");
    self.locService = [[BMKLocationService alloc] init];
    self.locService.delegate = self;
    [self.locService startUserLocationService];

  }
  else {
    NSLog(@"--- onGetPermissionState %d",iError);
  }
}

@end
