<template>
  <div class="produto-form">
    <div class="d-flex align-center na-mb-3">
      <v-btn icon class="mr-3" @click="voltar">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h1>{{ isEdicao ? 'Editar Produto' : 'Novo Produto' }}</h1>
    </div>
    
    <base-card>
      <v-form ref="form" @submit.prevent="salvar" v-model="formValido">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="produto.nome"
              label="Nome do Produto"
              :rules="[v => !!v || 'Nome é obrigatório']"
              required
            ></v-text-field>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-text-field
              v-model="produto.sku"
              label="SKU"
              :rules="[v => !!v || 'SKU é obrigatório']"
              required
            ></v-text-field>
          </v-col>
          
          <v-col cols="12">
            <v-textarea
              v-model="produto.descricao"
              label="Descrição"
              rows="3"
            ></v-textarea>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-select
              v-model="produto.categoriaId"
              :items="categorias"
              item-title="nome"
              item-value="id"
              label="Categoria"
              :rules="[v => !!v || 'Categoria é obrigatória']"
              required
              :loading="carregandoCategorias"
            ></v-select>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-select
              v-model="produto.fornecedorId"
              :items="fornecedores"
              item-title="nome"
              item-value="id"
              label="Fornecedor"
              :rules="[v => !!v || 'Fornecedor é obrigatório']"
              required
              :loading="carregandoFornecedores"
            ></v-select>
          </v-col>
          
          <v-col cols="12" md="4">
            <v-select
              v-model="produto.unidadeMedida"
              :items="unidadesMedida"
              label="Unidade de Medida"
              :rules="[v => !!v || 'Unidade de medida é obrigatória']"
              required
            ></v-select>
          </v-col>
          
          <v-col cols="12" md="4">
            <v-text-field
              v-model="produto.custo"
              label="Custo"
              type="number"
              step="0.01"
              prefix="R$"
              :rules="[
                v => !!v || 'Custo é obrigatório',
                v => v >= 0 || 'Custo deve ser maior ou igual a zero'
              ]"
              required
            ></v-text-field>
          </v-col>
          
          <v-col cols="12" md="4">
            <v-text-field
              v-model="produto.precoVenda"
              label="Preço de Venda"
              type="number"
              step="0.01"
              prefix="R$"
              :rules="[
                v => !!v || 'Preço de venda é obrigatório',
                v => v > 0 || 'Preço de venda deve ser maior que zero'
              ]"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        
        <v-divider class="na-my-3"></v-divider>
        <h3 class="text-h6 na-mb-3">Controle de Estoque</h3>
        
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="produto.quantidadeMinima"
              label="Quantidade Mínima"
              type="number"
              step="0.01"
              :suffix="produto.unidadeMedida"
              :rules="[
                v => v !== null || 'Quantidade mínima é obrigatória',
                v => v >= 0 || 'Quantidade mínima deve ser maior ou igual a zero'
              ]"
              required
            ></v-text-field>
          </v-col>
          
          <v-col cols="12" md="4">
            <v-text-field
              v-model="produto.quantidadeMaxima"
              label="Quantidade Máxima"
              type="number"
              step="0.01"
              :suffix="produto.unidadeMedida"
              :rules="[
                v => v !== null || 'Quantidade máxima é obrigatória',
                v => v >= 0 || 'Quantidade máxima deve ser maior ou igual a zero',
                v => !produto.quantidadeMinima || v >= produto.quantidadeMinima || 'Quantidade máxima deve ser maior ou igual à mínima'
              ]"
              required
            ></v-text-field>
          </v-col>
          
          <v-col cols="12" md="4">
            <v-text-field
              v-model="produto.quantidadeAtual"
              label="Estoque Inicial"
              type="number"
              step="0.01"
              :suffix="produto.unidadeMedida"
              :rules="[
                v => v !== null || 'Estoque inicial é obrigatório',
                v => v >= 0 || 'Estoque inicial deve ser maior ou igual a zero'
              ]"
              :disabled="isEdicao"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        
        <div class="d-flex justify-end">
          <v-btn
            variant="text"
            class="mr-2"
            @click="voltar"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            type="submit"
            :loading="salvando"
            :disabled="!formValido"
          >
            {{ isEdicao ? 'Atualizar' : 'Cadastrar' }}
          </v-btn>
        </div>
      </v-form>
    </base-card>
    
    <!-- Snackbar para notificações -->
    <base-snackbar
      v-model="snackbar.show"
      :text="snackbar.text"
      :color="snackbar.color"
    ></base-snackbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseCard from '@/components/BaseCard.vue'
import BaseSnackbar from '@/components/BaseSnackbar.vue'
import produtoService, { Produto } from '../services/produtoService'
import categoriaService, { Categoria } from '../services/categoriaService'
import fornecedorService, { Fornecedor } from '../services/fornecedorService'

export default defineComponent({
  name: 'ProdutoForm',
  components: {
    BaseCard,
    BaseSnackbar
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const form = ref(null)
    const formValido = ref(false)
    const salvando = ref(false)
    const carregandoCategorias = ref(false)
    const carregandoFornecedores = ref(false)
    const categorias = ref<Categoria[]>([])
    const fornecedores = ref<Fornecedor[]>([])
    const snackbar = ref({
      show: false,
      text: '',
      color: 'success'
    })
    
    // Unidades de medida disponíveis
    const unidadesMedida = [
      'UN', 'CX', 'PC', 'KG', 'L', 'M', 'M²', 'M³', 'PAR', 'CONJ'
    ]
    
    // Dados do produto
    const produto = ref<Produto>({
      nome: '',
      descricao: '',
      sku: '',
      categoriaId: 0,
      fornecedorId: 0,
      unidadeMedida: 'UN',
      quantidadeMinima: 0,
      quantidadeMaxima: 0,
      quantidadeAtual: 0,
      custo: 0,
      precoVenda: 0
    })
    
    // Verifica se é edição ou criação
    const isEdicao = computed(() => !!route.params.id)
    
    // Carrega a lista de categorias
    const carregarCategorias = async () => {
      carregandoCategorias.value = true
      try {
        categorias.value = await categoriaService.listar()
      } catch (error) {
        mostrarNotificacao('Erro ao carregar categorias', 'error')
        console.error(error)
      } finally {
        carregandoCategorias.value = false
      }
    }
    
    // Carrega a lista de fornecedores
    const carregarFornecedores = async () => {
      carregandoFornecedores.value = true
      try {
        fornecedores.value = await fornecedorService.listar()
      } catch (error) {
        mostrarNotificacao('Erro ao carregar fornecedores', 'error')
        console.error(error)
      } finally {
        carregandoFornecedores.value = false
      }
    }
    
    // Carrega os dados do produto para edição
    const carregarProduto = async () => {
      if (!isEdicao.value) return
      
      try {
        const id = parseInt(route.params.id as string)
        const data = await produtoService.buscarPorId(id)
        produto.value = data
      } catch (error) {
        mostrarNotificacao('Erro ao carregar dados do produto', 'error')
        console.error(error)
        router.push('/estoque/produtos')
      }
    }
    
    // Salva o produto (cria ou atualiza)
    const salvar = async () => {
      salvando.value = true
      
      try {
        if (isEdicao.value) {
          const id = parseInt(route.params.id as string)
          await produtoService.atualizar(id, produto.value)
          mostrarNotificacao('Produto atualizado com sucesso')
        } else {
          await produtoService.criar(produto.value)
          mostrarNotificacao('Produto cadastrado com sucesso')
        }
        
        // Volta para a listagem após salvar
        setTimeout(() => {
          router.push('/estoque/produtos')
        }, 1500)
      } catch (error) {
        mostrarNotificacao('Erro ao salvar produto', 'error')
        console.error(error)
      } finally {
        salvando.value = false
      }
    }
    
    // Volta para a listagem de produtos
    const voltar = () => {
      router.push('/estoque/produtos')
    }
    
    // Exibe uma notificação
    const mostrarNotificacao = (texto: string, cor: string = 'success') => {
      snackbar.value = {
        show: true,
        text: texto,
        color: cor
      }
    }
    
    // Carrega os dados ao montar o componente
    onMounted(() => {
      carregarCategorias()
      carregarFornecedores()
      carregarProduto()
    })
    
    return {
      produto,
      categorias,
      fornecedores,
      unidadesMedida,
      form,
      formValido,
      salvando,
      carregandoCategorias,
      carregandoFornecedores,
      isEdicao,
      snackbar,
      salvar,
      voltar
    }
  }
})
</script>