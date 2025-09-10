const db = require('../config/database')
const { decodeUserInfo } = require('../utils/decode-user')

// 获取用户地址列表
exports.getAddresses = async (req, res) => {
  try {
    const { userId } = req.params
    const userInfo = decodeUserInfo(req)
    const sql = `
      SELECT * FROM shipping_addresses 
      WHERE user_id = ?
      ORDER BY is_default DESC, id DESC
    `
    const [addresses] = await db.query(sql, [userInfo.id])
    
    res.json({
      code: 200,
      data: addresses,
      message: '获取成功'
    })
  } catch (error) {
    console.error('获取地址失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}

// 添加地址
exports.addAddress = async (req, res) => {
  try {
    const { user_id, receiver, phone, province, city, district, detail_address, is_default } = req.body
    
    // 处理直辖市的特殊情况
    let finalCity = city
    let finalDistrict = district
    
    // 如果是直辖市
    if (['北京市', '上海市', '天津市', '重庆市'].includes(province)) {
      finalCity = province    // 市级使用省份名称
      finalDistrict = city   // 区级使用传入的市级名称
    }

    const connection = await db.getConnection()
    await connection.beginTransaction()

    try {
      if (is_default) {
        await connection.query(
          'UPDATE shipping_addresses SET is_default = 0 WHERE user_id = ?',
          [user_id]
        )
      }

      await connection.query(
        `INSERT INTO shipping_addresses 
        (user_id, receiver, phone, province, city, district, detail_address, is_default)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [user_id, receiver, phone, province, finalCity, finalDistrict, detail_address, is_default]
      )

      await connection.commit()
      res.json({
        code: 200,
        message: '添加成功'
      })
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('添加地址失败:', error)
    res.status(500).json({
      code: 500, 
      message: '服务器错误'
    })
  }
}

// 删除地址
exports.deleteAddress = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { id } = req.params;
    const userInfo = decodeUserInfo(req);

    // 1. 验证地址是否属于当前用户
    const [addresses] = await connection.query(
      'SELECT * FROM shipping_addresses WHERE id = ? AND user_id = ?',
      [id, userInfo.id]
    );

    if (addresses.length === 0) {
      await connection.rollback();
      return res.json({
        code: 400,
        message: '地址不存在或无权限删除'
      });
    }

    // 2. 检查地址是否被订单使用
    const [orders] = await connection.query(
      'SELECT id FROM orders WHERE address_id = ?',
      [id]
    );

    if (orders.length > 0) {
      await connection.rollback();
      return res.json({
        code: 400,
        message: '该地址已被订单使用，不能删除'
      });
    }

    // 3. 如果是默认地址，需要重新设置其他地址为默认
    if (addresses[0].is_default) {
      const [otherAddresses] = await connection.query(
        'SELECT id FROM shipping_addresses WHERE user_id = ? AND id != ? LIMIT 1',
        [userInfo.id, id]
      );
      
      if (otherAddresses.length > 0) {
        await connection.query(
          'UPDATE shipping_addresses SET is_default = 1 WHERE id = ?',
          [otherAddresses[0].id]
        );
      }
    }

    // 4. 删除地址
    await connection.query(
      'DELETE FROM shipping_addresses WHERE id = ?',
      [id]
    );

    await connection.commit();

    res.json({
      code: 200,
      message: '删除成功'
    });
  } catch (error) {
    await connection.rollback();
    console.error('删除地址失败:', error);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  } finally {
    connection.release();
  }
};

// 编辑地址
exports.updateAddress = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { id } = req.params;
    const userInfo = decodeUserInfo(req);
    const { receiver, phone, province, city, district, detail_address, is_default } = req.body;

    // 1. 验证地址是否属于当前用户
    const [addresses] = await connection.query(
      'SELECT * FROM shipping_addresses WHERE id = ? AND user_id = ?',
      [id, userInfo.id]
    );

    if (addresses.length === 0) {
      await connection.rollback();
      return res.json({
        code: 400,
        message: '地址不存在或无权限修改'
      });
    }

    // 2. 如果设置为默认地址，先将其他地址设为非默认
    if (is_default) {
      await connection.query(
        'UPDATE shipping_addresses SET is_default = 0 WHERE user_id = ? AND id != ?',
        [userInfo.id, id]
      );
    }

    // 3. 更新地址
    await connection.query(
      `UPDATE shipping_addresses SET 
        receiver = ?,
        phone = ?,
        province = ?,
        city = ?,
        district = ?,
        detail_address = ?,
        is_default = ?
      WHERE id = ?`,
      [receiver, phone, province, city, district, detail_address, is_default, id]
    );

    await connection.commit();

    res.json({
      code: 200,
      message: '更新成功'
    });
  } catch (error) {
    await connection.rollback();
    console.error('更新地址失败:', error);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  } finally {
    connection.release();
  }
}; 