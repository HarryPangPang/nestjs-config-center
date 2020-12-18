import axios from 'axios'
import { CreateConfigDto } from './config/dto/config.dto';
import { QueryConfigDto } from './config/dto/config.query.dto';

/**
 * 从服务端创建值
 * @param createCatDto 
 */
const ConfigCreate = async (createCatDto: CreateConfigDto) => {
    return await (await axios.post('http://localhost:65511/api/config/create', createCatDto)).data
}

/**
 * 从服务端获取值
 * @param queryConfigDto 
 */
const ConfigGet = async (queryConfigDto: QueryConfigDto) => {
    return await (await axios.post('http://localhost:65511/api/config/get', queryConfigDto)).data
}

/**
 * 更新服务端值
 * @param createCatDto 
 */
const ConfigUpdate = async (createCatDto: CreateConfigDto) => {
    return await (await axios.post('http://localhost:65511/api/config/update', createCatDto)).data
}


/**
 * 删除务端值
 * @param queryConfigDto 
 */
const ConfigDelete = async (queryConfigDto: QueryConfigDto) => {
    return await (await axios.post('http://localhost:65511/api/config/delete', queryConfigDto)).data
}

export {
    ConfigUpdate,
    ConfigDelete,
    ConfigGet,
    ConfigCreate
}