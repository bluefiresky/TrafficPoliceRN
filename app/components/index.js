/**
 * Created by wuran on 16/12/21.
 * 输出 所有 自定义组件
 */

export { XButton } from './custom/XButton.js';           /** 自定义Button按钮 */
export { RadioButton } from './custom/RadioButton.js';   /** 自定义单选按钮 */
export { Input } from './custom/Input.js';               /** 自定义TextInput组件，可以绑定fileds值 */
export { InputWithIcon } from './custom/InputWithIcon.js'; /** 自定义TextInput组件，lable为Icon */
export { InputPlaceholder } from './custom/InputPlaceholder.js'; /** 无lable输入组件 */
export { UploadImageView } from './custom/UploadImage.js'; /** 自定义可上传服务器并返回上传后地址的ImageView */
export { EmptyView } from './custom/EmptyView.js'; /** 自定义可上传服务器并返回上传后地址的ImageView */
export { UpdateModal } from './custom/UpdateModal.js';
export { TipModal } from './custom/TipModal.js';  /** 可自定义参数弹出提示框 */
export { InsurancePicker} from './custom/InsurancePicker.js';  /** 保险Picker **/
export { CarTypePicker} from './custom/CarTypePicker.js';      /** 车辆类型Picker **/
export { DutyTypePicker} from './custom/DutyTypePicker.js';    /** 责任Picker **/


/** Basic Component [注]可在custom逐渐集中对其进行自定义修改*/
export { BaseView } from './basic/BaseView.js';         /** 基础View，提供一些提特定的基础显示效果 */
export { ProgressView } from './basic/ProgressView.js'; /** 基础Viuw, 提供通用progress等待效果 */
export { Form } from './basic/form/Form.js';                      /** Form 组件，提供表单所提交的数据和验证等方法 */
export { form_connector } from './basic/form/form_connector.js';  /** Form 组件，链接数据View和Form之间的枢纽 */
export { FormContainer } from './basic/form/FormContainer.js';    /** Form 组件，提供Form外衣，是Form可以正常工作*/
import * as ValidateMethods from './basic/form/validate.js';
export { ValidateMethods };                                       /** Form 组件，提供具体的验证方法 */
export { ScrollerSegment } from './custom/ScrollSegment.js';
export { SelectCarNum } from './custom/SelectCarNum.js';
